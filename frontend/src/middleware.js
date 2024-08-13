import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import { firstStoreRedirect } from "../src/lib/utilities";
export async function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  const session = await getToken({req: request,secret: process.env.NEXTAUTH_SECRET});
  const protectedSubdomains = ['admin',];

  if (protectedSubdomains.includes(subdomain) && !session) {
    url.pathname = '/login';
    url.host = 'accounts.nour.com';
    url.port = '80';
    return NextResponse.redirect(url);
  }

  if (subdomain == 'accounts' && session && url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (subdomain == 'accounts' && !session && url.pathname.startsWith("/store-create")) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }



  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/assets')|| url.pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Handling auth routes on accounts subdomain
  if (url.pathname.startsWith('/api/auth') && subdomain !== 'accounts') {
    const newUrl = new URL(url);
    newUrl.hostname = 'accounts.nour.com';
    return NextResponse.redirect(newUrl);
  }

  if (subdomain === 'accounts' && url.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  if (subdomain === "admin" && session) {
    if (session.has_store === false) {
      url.pathname = '/store-create';
      url.host = "accounts.nour.com";
      url.port = "80";
      return NextResponse.redirect(url);
    }
    if (session.has_store === true && url.pathname === '/') {
      try {
        const domain = await firstStoreRedirect(session);
        if (domain) {
          url.pathname = `/store/${domain}`;
          return NextResponse.redirect(url);
        }
      } catch (e) {}
    }
  }
  // admin
  if (url.pathname.startsWith('/admin') && subdomain !== 'admin') {
    const newUrl = `http://admin.nour.com${url.pathname.replace('/admin', '')}`;
    return NextResponse.redirect(newUrl);
  }
  if (subdomain === 'admin') {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // accounts
  if (url.pathname.startsWith('/accounts') && subdomain!== 'accounts') {
    return NextResponse.error();
  }
  if (subdomain === 'accounts') {
    url.pathname = `/accounts${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
