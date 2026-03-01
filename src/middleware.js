import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require a login
const isProtectedRoute = createRouteMatcher(['/studio(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Check if the current request matches a protected route
  if (isProtectedRoute(req)) {
    // Note: No parentheses after auth
    await auth.protect();
  }
});

export const config = {
  // This matcher ensures the middleware runs on all routes 
  // except static files and internal Next.js paths
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};