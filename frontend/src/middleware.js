import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  
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
