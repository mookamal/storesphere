import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Ensure the environment variable is defined
    const backendUrl = process.env.NEXTAUTH_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('Environment variable NEXTAUTH_BACKEND_URL is not defined');
    }

    // Send POST request
    const response = await axios.post(
      `${backendUrl}/register/`,
        data
    );
    


    // Return the response data
    if (response.status === 201) {
      return NextResponse.json({ success: response.data.detail }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Registration failed!' }, { status: response.status });
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
        const { data } = error.response;
        return NextResponse.json({ error: data }, { status: 400 });
    }
  }
}
