import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validation of data entered
    if (!data.email || !data.password1) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    // Ensure the environment variable is defined
    const backendUrl = process.env.NEXTAUTH_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('Environment variable NEXTAUTH_BACKEND_URL is not defined');
    }

    // Create an AbortController and a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 ثواني كحد أقصى

    try {
      // Send POST request with additional options
      const response = await axios.post(
        `${backendUrl}/register/`,
        data,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      clearTimeout(timeoutId);

      // Check the response status
      if (response.status === 201) {
        return NextResponse.json(
          { 
            success: 'Registration successful', 
            detail: response.data.detail 
          }, 
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Unexpected response from server' }, 
          { status: response.status }
        );
      }
    } catch (axiosError) {
      clearTimeout(timeoutId);

      // Handle axios errors
      if (axiosError.response) {
        // The server responded with a status code outside the 2xx range
        return NextResponse.json(
          { 
            error: axiosError.response.data || 'Registration failed',
            details: axiosError.response.data 
          }, 
          { status: axiosError.response.status }
        );
      } else if (axiosError.request) {
        // The request was made but no response was received
        return NextResponse.json(
          { error: 'No response received from server' }, 
          { status: 500 }
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        return NextResponse.json(
          { error: 'Error setting up registration request' }, 
          { status: 500 }
        );
      }
    }
  } catch (error) {
    // Unexpected error
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Preventing unauthorized methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' }, 
    { status: 405 }
  );
}