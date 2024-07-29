"use server";

import { NextResponse } from "next/server";
import { setToken , setRefreshToken } from "../../../../lib/auth";
const API_LOGIN_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/`;

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
        const response = await fetch(API_LOGIN_URL, requestOptions)
        const responseData = await response.json()
        
        if (response.status >= 200 && response.status < 300) {
            const {access, refresh} = responseData
            setToken(access);
            setRefreshToken(refresh);
            return NextResponse.json({success: ""},{status: 200})
        } else {
            return NextResponse.json({error: responseData},{status: response.status})
        }
    } catch (error) {

        return NextResponse.json({error: 'Server Error'}, {status: 500});
    }
}