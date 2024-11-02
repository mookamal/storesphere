import axios from "axios";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { storeName } = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendUrl) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_API_BASE_URL is not defined"
      );
    }

    const dataStore = {
      name: storeName,
    };
    // Send post request
    const response = await axios.post(
      `${backendUrl}/s/stores/create/`,
      dataStore,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      // Check if the status is 201 Created
      return NextResponse.json({ domain: response.data.default_domain });
    } else {
      return NextResponse.json({
        error: "Failed to create store",
        details: response.data,
      });
    }
  } catch (e) {
    console.error("Error creating store:", e.message);
    return NextResponse.json({
      error: "Failed to create store",
      details: e.message,
    });
  }
}
