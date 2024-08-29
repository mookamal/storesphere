import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from 'axios';
export async function POST(request) {
    
    try {
        const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { query, variables } = await request.json();
        if (!query ||!variables) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const response = await axios.post(process.env.GRAPHQL_BACKEND_URL,{
            query,
            variables
        },
        {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            }
        }
        );
        const data = await response.data;
        if (data.errors) {
            return NextResponse.json({ error: data.errors[0].message }, { status: 400 });
        }
        console.log();

        return NextResponse.json({data: response.data.data } , { status: 200})

    } catch (error) { 
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}