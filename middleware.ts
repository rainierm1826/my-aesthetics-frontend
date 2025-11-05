import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route patterns and their allowed roles
const routeConfig = {
  public: [
    "/",
    "/services",
    "/aesthetician",
    "/branches",
    "/about-us",
  ],
  customer: [
    "/customer/dashboard",
    "/customer/profile",
    "/customer/history",
  ],
  admin: [
    "/manage/appointments",
    "/manage/customer",
    "/manage/aesthetician",
    "/manage/service",
    "/manage/voucher",
    "/manage/profile",
  ],
  owner: [
    "/manage/dashboard/appointments",
    "/manage/dashboard/sales",
    "/manage/appointments",
    "/manage/customer",
    "/manage/aesthetician",
    "/manage/service",
    "/manage/voucher",
    "/manage/settings",
    "/manage/profile",
    "/manage/branch",
    "/manage/admin",
  ],
};

type UserRole = "customer" | "admin" | "owner";

interface AuthPayload {
  account_id: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
}

// Helper function to decode JWT token (without verification for middleware speed)
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Helper function to get auth info from cookies
function getAuthFromCookies(request: NextRequest): AuthPayload | null {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    
    if (!accessToken) {
      return null;
    }

    const decoded = decodeJWT(accessToken);
    
    if (!decoded || !decoded.sub || !decoded.role) {
      return null;
    }

    // Check if token is expired
    const exp = decoded.exp as number | undefined;
    if (exp && exp * 1000 < Date.now()) {
      return null;
    }

    return {
      account_id: decoded.sub as string,
      email: (decoded.email as string) || "",
      role: decoded.role as UserRole,
      is_verified: (decoded.is_verified as boolean) || false,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Helper function to check if a path matches a route pattern
function matchesRoute(pathname: string, routePattern: string): boolean {
  // Exact match
  if (pathname === routePattern) return true;
  
  // Check if it's a child route (e.g., /manage/profile/edit matches /manage/profile)
  if (pathname.startsWith(routePattern + "/")) return true;
  
  return false;
}

// Helper function to check if path is allowed for role
function isRouteAllowedForRole(
  pathname: string,
  role: UserRole | null
): boolean {
  // Check if it's a public route
  if (routeConfig.public.some((route) => matchesRoute(pathname, route))) {
    return true;
  }

  // If no role (not authenticated), only public routes are allowed
  if (!role) {
    return false;
  }

  // Check role-specific routes
  switch (role) {
    case "customer":
      return routeConfig.customer.some((route) => matchesRoute(pathname, route));
    
    case "admin":
      return (
        routeConfig.admin.some((route) => matchesRoute(pathname, route)) ||
        routeConfig.customer.some((route) => matchesRoute(pathname, route))
      );
    
    case "owner":
      return (
        routeConfig.owner.some((route) => matchesRoute(pathname, route)) ||
        routeConfig.admin.some((route) => matchesRoute(pathname, route)) ||
        routeConfig.customer.some((route) => matchesRoute(pathname, route))
      );
    
    default:
      return false;
  }
}

// Helper function to get redirect URL based on role
function getRedirectUrl(role: UserRole | null): string {
  if (!role) return "/";
  
  switch (role) {
    case "customer":
      return "/customer/dashboard";
    case "admin":
      return "/manage/appointments";
    case "owner":
      return "/manage/dashboard/appointments";
    default:
      return "/";
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get authentication info from cookies
  const authData = getAuthFromCookies(request);
  const userRole = authData?.role || null;

  // Check if the route is allowed for the user's role
  const isAllowed = isRouteAllowedForRole(pathname, userRole);

  if (!isAllowed) {
    // If not allowed, redirect to appropriate page
    const redirectUrl = getRedirectUrl(userRole);
    const url = request.nextUrl.clone();
    url.pathname = redirectUrl;
    
    // Add a query parameter to show why they were redirected
    if (!userRole) {
      url.searchParams.set("redirect", pathname);
    } 
    
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access sign-in/sign-up, redirect to their dashboard
  if (
    userRole &&
    (pathname === "/sign-in" || pathname === "/sign-up")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = getRedirectUrl(userRole);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
