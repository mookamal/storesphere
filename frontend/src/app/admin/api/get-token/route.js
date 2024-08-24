import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ access_token: session.access_token });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
