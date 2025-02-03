import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { checkHasStore } from "../lib/utilities";
const BACKEND_ACCESS_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  credentials: async (user, account, profile, email, credentials) => {
    return true;
  },
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const authOptions = {
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
      async authorize(credentials, req) {
        try {
          const response = await axios({
            url: process.env.NEXTAUTH_BACKEND_URL + "/login/",
            method: "post",
            data: credentials,
          });
          const data = response.data;
          if (data) return data;
        } catch (error) {
          console.error(error);
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
      return SIGN_IN_HANDLERS[account.provider](
        user,
        account,
        profile,
        email,
        credentials
      );
    },
    async jwt({ user, token, account }) {
      if (user && account) {
        let backendResponse =
          account.provider === "credentials" ? user : account.meta;
        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token.exp = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        token["has_store"] = false;
        return token;
      }
      if (getCurrentEpochTime() > token.exp) {
        try {
          const response = await axios({
            method: "post",
            url: process.env.NEXTAUTH_BACKEND_URL + "/token/refresh/",
            data: {
              refresh: token["refresh_token"],
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          token["access_token"] = response.data.access;
          token.exp = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        } catch (error) {
          console.error("Token refresh failed:", error);
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }
      return token;
    },
    async session({ token }) {
      if (token.error) {
        console.warn("Session token error:", token.error);
        return {
          user: token.user,
          error: token.error,
        };
      }
      if (token.has_store === false) {
        try {
          token.has_store = await checkHasStore(token);
        } catch (error) {
          console.error("Error checking store:", error);
        }
      }

      return {
        ...token,
        error: token.error,
      };
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
    refreshToken: {
      name: `${
        NEXTAUTH_URL.startsWith("https://") ? "__secure-" : ""
      }next-auth.refresh-token`,
      options: {
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        secure: NEXTAUTH_URL.startsWith("https://"),
      },
    },
    accessToken: {
      name: `${
        NEXTAUTH_URL.startsWith("https://") ? "__secure-" : ""
      }next-auth.access-token`,
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
