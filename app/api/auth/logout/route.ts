import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response that clears the auth token cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    
    // Clear the auth_token cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}