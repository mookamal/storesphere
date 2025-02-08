import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { checkHasStore } from "../lib/utilities";
import { NextAuthOptions, Session, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

// Token lifetime constants
const BACKEND_ACCESS_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || '';

// Get current epoch time
const getCurrentEpochTime = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

// Backend response interface
interface BackendResponse {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  access: string;
  refresh: string;
}

// Sign-in handlers interface
interface SignInHandlers {
  [key: string]: (
    user: any, 
    account: any, 
    profile: any, 
    email: any, 
    credentials: any
  ) => Promise<boolean>;
}

// Sign-in handlers
const SIGN_IN_HANDLERS: SignInHandlers = {
  credentials: async () => true,
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

// Extended JWT type
interface CustomJWT extends JWT {
  user?: User;
  access_token?: string;
  refresh_token?: string;
  has_store?: boolean;
  error?: string;
  exp?: number;
}

// Extended Session type
interface CustomSession extends Session {
  access_token?: string;
  refresh_token?: string;
  has_store?: boolean;
  error?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios({
            url: `${process.env.NEXTAUTH_BACKEND_URL}/login/`,
            method: "post",
            data: credentials,
          });
          const data = response.data as BackendResponse;
          if (data) {
            // Convert backend response to NextAuth User type
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              access_token: data.access,
              refresh_token: data.refresh,
            };
          }
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account?.provider || '')) return false;
      return SIGN_IN_HANDLERS[account?.provider || ''](
        user,
        account,
        profile,
        email,
        credentials
      );
    },
    async jwt({ user, token, account }) {
      const customToken = token as CustomJWT;

      // Initial token creation
      if (user && account) {
        customToken.user = user;
        customToken.access_token = (user as any).access_token;
        customToken.refresh_token = (user as any).refresh_token;
        customToken.exp = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        customToken.has_store = false;
        return customToken;
      }

      // Token refresh
      const currentTime = getCurrentEpochTime();
      if (customToken.exp && currentTime > customToken.exp) {
        try {
          const response = await axios({
            method: "post",
            url: `${process.env.NEXTAUTH_BACKEND_URL}/token/refresh/`,
            data: {
              refresh: customToken.refresh_token,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          customToken.access_token = response.data.access;
          customToken.exp = currentTime + BACKEND_ACCESS_TOKEN_LIFETIME;
        } catch (error) {
          console.error("Token refresh failed:", error);
          return {
            ...customToken,
            error: "RefreshAccessTokenError",
          };
        }
      }
      return customToken;
    },
    async session({ token }) {
      const customToken = token as CustomJWT;
      const session: CustomSession = {
        expires: customToken.exp 
          ? new Date(customToken.exp * 1000).toISOString() 
          : new Date(Date.now() + BACKEND_REFRESH_TOKEN_LIFETIME * 1000).toISOString(),
        user: customToken.user!,
        access_token: customToken.access_token,
        refresh_token: customToken.refresh_token,
        has_store: customToken.has_store,
        error: customToken.error,
      };

      if (customToken.error) {
        console.warn("Session token error:", customToken.error);
        return session;
      }

      if (customToken.has_store === false) {
        try {
          session.has_store = await checkHasStore(customToken);
        } catch (error) {
          console.error("Error checking store:", error);
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `${
        NEXTAUTH_URL.startsWith("https://") ? "__secure-" : ""
      }next-auth.session-token`,
      options: {
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
      },
    },
  },
};