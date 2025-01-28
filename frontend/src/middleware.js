import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { firstStoreRedirect } from "@/lib/utilities";

// Constants for protected routes and subdomains
const PROTECTED_SUBDOMAINS = ["admin"];
const STATIC_PATHS = ["/_next", "/assets", "/static"];
const AUTH_SUBDOMAIN = "accounts";
export async function middleware(request) {
  try {
    const url = request.nextUrl.clone();
    const host = request.headers.get("host") || "";
    const subdomain = host.split(".")[0];
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // Check token expiration
    if (session?.exp && Date.now() / 1000 > session.exp) {
      return redirectToLogin(url);
    }
    // Skip middleware for static files
    if (STATIC_PATHS.some(path => url.pathname.startsWith(path))) {
      return NextResponse.next();
    }
    if (PROTECTED_SUBDOMAINS.includes(subdomain) && !session) {
      return redirectToLogin(url);
    }
  
    if (
      subdomain === "accounts" &&
      session &&
      (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  
    if (
      subdomain == "accounts" &&
      !session &&
      url.pathname.startsWith("/store-create")
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  
  
    // Handling auth routes on accounts subdomain
    if (url.pathname.startsWith("/api/auth") && subdomain !== "accounts") {
      const newUrl = new URL(url);
      newUrl.hostname = "accounts.nour.com";
      return NextResponse.redirect(newUrl);
    }
  
    if (subdomain === "accounts" && url.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
  
    if (subdomain === "admin" && session) {
      if (url.pathname === "/") {
        try {
          const domain = await firstStoreRedirect(session);
          if (domain) {
            url.pathname = `/store/${domain}`;
            return NextResponse.redirect(url);
          } else {
            url.pathname = "/create-store";
            return NextResponse.redirect(url);
          }
        } catch (e) {}
      }
    }
    // admin
    if (url.pathname.startsWith("/admin") && subdomain !== "admin") {
      const newUrl = `http://admin.nour.com${url.pathname.replace("/admin", "")}`;
      return NextResponse.redirect(newUrl);
    }
    if (subdomain === "admin") {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  
    // accounts
    if (url.pathname.startsWith("/accounts") && subdomain !== "accounts") {
      return NextResponse.error();
    }
    if (subdomain === "accounts") {
      url.pathname = `/accounts${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
  }
}

// Helper function to redirect to login
function redirectToLogin(url) {
  url.pathname = "/login";
  url.host = `${AUTH_SUBDOMAIN}.nour.com`;
  url.port = "80";
  return NextResponse.redirect(url);
}