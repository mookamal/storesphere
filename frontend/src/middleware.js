// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { firstStoreRedirect } from "@/lib/utilities";

// --- Constants (Should be moved to constants.js) ---
const PROTECTED_SUBDOMAINS = new Set(["admin"]);
const STATIC_PATHS = ["/_next", "/assets", "/static"];
const AUTH_SUBDOMAIN = "accounts";
const PUBLIC_PATHS = ["/login", "/signup"];

// --- Helper Functions (Should be moved to utils/helpers.js) ---
const isTokenExpired = (exp) => Date.now() >= exp * 1000;

const handleApiAuth = (subdomain, url) => {
  if (subdomain === AUTH_SUBDOMAIN) return NextResponse.next();

  const newUrl = new URL(url);
  newUrl.hostname = `${AUTH_SUBDOMAIN}.nour.com`;
  return NextResponse.rewrite(newUrl);
};

const handleProtectedSubdomains = (subdomain, session, url, pathname) => {
  if (!session) return redirectToLogin(url);

  if (subdomain === "admin") {
    return NextResponse.next();
  }

  if (subdomain === AUTH_SUBDOMAIN) {
    if (session && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
};

const handleAdminRootRedirect = async (session, url) => {
  try {
    const domain = await firstStoreRedirect(session);
    url.pathname = domain ? `/store/${domain}` : "/store-create";
    return NextResponse.redirect(url);
  } catch (e) {
    console.error("Store redirect error:", e);
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }
};

const redirectToSubdomain = (sub, url) => {
  const newUrl = `http://${sub}.nour.com${url.pathname.replace(`/${sub}`, "")}`;
  return NextResponse.redirect(newUrl);
};

const redirectToLogin = (url) => {
  url.pathname = "/login";
  url.host = `${AUTH_SUBDOMAIN}.nour.com`;
  return NextResponse.redirect(url);
};

// --- Main Middleware Function ---
export async function middleware(request) {
  try {
    const url = request.nextUrl.clone();
    const host = request.headers.get("host")?.split(":")[0] || "";
    const subdomain = host.split(".")[0];
    const { pathname } = url;

    // Static files handling
    if (STATIC_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // API Authentication routing
    if (pathname.startsWith("/api/auth")) {
      return handleApiAuth(subdomain, url);
    }

    // Session handling
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Token expiration check
    if (session?.exp && isTokenExpired(session.exp)) {
      return redirectToLogin(url);
    }

    // Protected subdomains handling
    if (PROTECTED_SUBDOMAINS.has(subdomain)) {
      return handleProtectedSubdomains(subdomain, session, url, pathname);
    }

    // Subdomain-specific redirects
    if (pathname.startsWith("/admin")) {
      return redirectToSubdomain("admin", url);
    }

    if (pathname.startsWith("/accounts")) {
      return redirectToSubdomain(AUTH_SUBDOMAIN, url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.error(new Error("Internal Server Error"), {
      status: 500,
    });
  }
}
