import axios from "axios";

export const formatMsgServer = (msgs) => {
  const formattedMessages = {};

  for (const [field, messages] of Object.entries(msgs)) {
    if (Array.isArray(messages)) {
      formattedMessages[field] = messages.join(". ");
    } else {
      formattedMessages[field] = messages;
    }
  }

  return formattedMessages;
};

export const isEmail = (input) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(input);
};

export function getShortInitials(name) {
  const names = name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
}

export async function checkHasStore(session) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (response.data.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    if (e.response && e.response.status === 404) {
      return false;
    } else {
      console.error("Error fetching stores:", e.message);
      throw new Error("Failed to check stores");
    }
  }
}

export async function firstStoreRedirect(session) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/first-store/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    if (response.data) {
      return response.data.default_domain;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error fetching first store:", e.message);
    throw new Error("Failed to fetch first store");
  }
}

export function handleGraphQLError(error) {
  try {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || error.message;

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
    } else if (error.request) {
      return {
        type: "NO_RESPONSE",
        message: "No response received from the server. Check your network.",
        status: null,
      };
    } else {
      return {
        type: "CLIENT_ERROR",
        message: error.message || "An unknown client-side error occurred.",
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
