import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the JWT token from cookies
  const token = request.cookies.get("jwt")?.value

  // Define protected routes that require authentication
  const protectedRoutes = ["/profile"]
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Define auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ["/sign-in", "/sign-up"]
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing a protected route without a token, redirect to sign-in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // If accessing an auth route with a valid token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 
