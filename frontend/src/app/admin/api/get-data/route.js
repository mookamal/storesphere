import { getClient } from "@/lib/ApolloClient";
import { NextResponse } from "next/server";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
export async function POST(request) {
    const client =  getClient();
    const { data } =  await client.query({ query: GET_SETTINGS_GENERAL, variables: {domain: "mel3o"}});
    return NextResponse.json(data);
}