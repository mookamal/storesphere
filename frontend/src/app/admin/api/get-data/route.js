import { getClient } from "@/lib/ApolloClient";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export async function POST(request) {
    
    try {
        const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = getClient();
        const { query, variables } = await request.json();
        if (!query || !variables) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        const { data } = await client.query({
            query: query, variables: variables, context: {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            }
        });
        if (!data.shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error) { 
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}