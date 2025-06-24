import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is visiting the homepage
  if (request.nextUrl.pathname === '/') {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // For all other routes, continue normally
  return NextResponse.next()
}