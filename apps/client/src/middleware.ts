import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./entities/auth/utils/verifyToken";

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const verified = refreshToken && (await verifyToken(refreshToken));

  if (!verified) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (Date.now() < verified?.exp) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/profile", "/"],
};
