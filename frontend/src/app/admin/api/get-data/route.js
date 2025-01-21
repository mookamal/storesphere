import { getClient } from "@/lib/ApolloClient";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Validate request parameters
function validateRequest(query, variables) {
  if (!query || !variables) {
    console.error('Invalid request parameters');
    throw new Error("Invalid request parameters");
  }
}

// Centralized error handling
function handleError(error) {
  // Handle GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    console.error('GraphQL Error:', {
      message: graphQLError?.message || 'Unknown GraphQL error',
      extensions: graphQLError?.extensions || {}
    });
    return NextResponse.json(
      { 
        error: graphQLError?.message || 'Unknown GraphQL error',
        extensions: graphQLError?.extensions || {}
      },
      { status: graphQLError?.extensions?.status || 500 }
    );
  }

  // Handle unexpected errors
  console.error('Unexpected Error:', error);
  return NextResponse.json(
    { 
      error: error.message || 'Internal Server Error', 
      details: error.toString() 
    },
    { status: 500 }
  );
}

export async function POST(request) {
  try {
    // Authenticate user session
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check user authorization
    if (!session) {
      console.warn('Unauthorized access attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = getClient();
    const { query, variables } = await request.json();

    // Validate request
    validateRequest(query, variables);

    // Execute GraphQL query
    const { data } = await client.query({
      query: query,
      variables: variables,
      context: {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    });

    // Check data existence
    if (!data) {
      console.info('No data found for query');
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    // Handle any errors that occur during the process
    return handleError(error);
  }
}
