import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const publicRoutes = ['/login', '/register', '/api/public'];
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}