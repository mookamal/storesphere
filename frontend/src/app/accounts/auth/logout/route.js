"use server";

import { NextResponse } from "next/server";
import { deleteTokens } from "../../../../lib/auth";

export async function POST(request) {
    const tokenResponse = deleteTokens()
    console.log(tokenResponse)

    return NextResponse.json({} , {status: 200})
}