"use server"

import { NextResponse } from "next/server";

const API_REGISTER_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/`;

export async function POST(request) {
    try {
        const requestData = await request.json()
        const jsonData = JSON.stringify(requestData)
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        }
        const response = await fetch(API_REGISTER_URL, requestOptions)
        const responseData = await response.json()
        
        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json({success: responseData},{status: 200})
        } else {
            return NextResponse.json({error: responseData},{status: response.status})
        }

    } catch (error) {

        return NextResponse.json({error: 'Server Error'}, {status: 500});
    }
}