import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = parse(cookieHeader || '');
  const userAuthToken = cookies.userAuthToken;
  const adminAuthToken = cookies.adminAuthToken;
  const vendorAuthToken = cookies.vendorAuthToken;

  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/auth/register';
  const isSignInPage = pathname === '/auth/signIn';

  // Redirect logged-in users away from auth pages
  if (token && (isAuthPage || isSignInPage)) {
    console.log(token)
    return NextResponse.redirect(new URL(`/users/${token._id}`, req.nextUrl.origin));
  }

  // Redirect user to their profile if they are already logged in
  if (userAuthToken && (isAuthPage || isSignInPage)) {
    return NextResponse.redirect(new URL(`/users/${userAuthToken?.id}`, req.nextUrl.origin));
  }

  

  // Protect /users routes and redirect to sign-in if not authenticated
  if (pathname.startsWith('/users') && !(token || userAuthToken) && !isSignInPage) {
    return NextResponse.redirect(new URL('/auth/signIn', req.nextUrl.origin));
  }
  

  // Protect /admin/dashboard routes and redirect to admin auth if not authenticated
  if (pathname.startsWith('/admin/dashboard') && !adminAuthToken) {
    return NextResponse.redirect(new URL('/admin/auth', req.nextUrl.origin));
  }

  // Protect /admin/dashboard routes and redirect to admin auth if not authenticated
  if (pathname.startsWith('/vendor/dashboard') && !vendorAuthToken) {
    return NextResponse.redirect(new URL('/admin/auth', req.nextUrl.origin));
  }

  // Allow access to the requested page if all conditions pass
  return NextResponse.next();
}
