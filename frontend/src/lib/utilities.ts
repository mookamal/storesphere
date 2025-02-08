import axios, { AxiosError, AxiosResponse } from "axios";
import { CustomJWT } from "@/lib/nextAuth";
// Interfaces for type safety
interface FormattedMessages {
  [key: string]: string;
}

interface ErrorResponse {
  type: string;
  message: string;
  status: number | null;
}


export const formatMsgServer = (msgs: Record<string, string | string[]>): FormattedMessages => {
  const formattedMessages: FormattedMessages = {};

  for (const [field, messages] of Object.entries(msgs)) {
    if (Array.isArray(messages)) {
      formattedMessages[field] = messages.join(". ");
    } else {
      formattedMessages[field] = messages;
    }
  }

  return formattedMessages;
};

export const isEmail = (input: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(input);
};

export function getShortInitials(name: string): string {
  const names = name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
}

export async function checkHasStore(session: CustomJWT): Promise<boolean> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return response.data.length > 0;
  } catch (e: unknown) {
    const error = e as AxiosError;
    if (error.response && (error.response as AxiosResponse).status === 404) {
      return false;
    } else {
      console.error("Error fetching stores:", error.message);
      throw new Error("Failed to check stores");
    }
  }
}

export async function firstStoreRedirect(session: CustomJWT): Promise<string | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/first-store/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    return response.data ? response.data.default_domain : null;
  } catch (e: unknown) {
    const error = e as Error;
    console.error("Error fetching first store:", error.message);
    throw new Error("Failed to fetch first store");
  }
}

export function handleGraphQLError(error: unknown): ErrorResponse {
  try {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const message = (axiosError.response.data as any)?.message || axiosError.message;

      switch (status) {
        case 404:
          return { type: "NOT_FOUND", message: "Resource not found.", status };
        case 401:
          return {
            type: "UNAUTHORIZED",
            message: "Unauthorized access.",
            status,
          };
        case 400:
          return { type: "BAD_REQUEST", message: "Bad request.", status };
        case 500:
          return {
            type: "SERVER_ERROR",
            message: "Server error occurred.",
            status,
          };
        default:
          return {
            type: "UNKNOWN_ERROR",
            message: message || "An unexpected error occurred.",
            status,
          };
      }
    } else if (axiosError.request) {
      return {
        type: "NO_RESPONSE",
        message: "No response received from the server. Check your network.",
        status: null,
      };
    } else {
      return {
        type: "CLIENT_ERROR",
        message: axiosError.message || "An unknown client-side error occurred.",
        status: null,
      };
    }
  } catch (err) {
    return {
      type: "PROCESSING_ERROR",
      message: "Error processing the error response.",
      status: null,
    };
  }
}