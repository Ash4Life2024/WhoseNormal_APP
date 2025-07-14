import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "7367f828-0a83-44c8-b25e-e60b0853ea87");
  requestHeaders.set("x-createxyz-project-group-id", "00eebf84-06cb-4740-bb05-22d5e7cc5881");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}