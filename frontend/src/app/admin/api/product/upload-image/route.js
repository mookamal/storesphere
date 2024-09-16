import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";

export async function POST(request) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/p/upload/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );
  return NextResponse.json(response.data);
}
