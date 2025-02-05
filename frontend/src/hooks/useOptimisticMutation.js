import { useMutation } from "@apollo/client";

export const useOptimisticMutation = (mutation, config = {}) => {
  const [mutate, { loading, error }] = useMutation(mutation, {
    onCompleted: (data) => {
      if (config.onSuccess) {
        config.onSuccess(data);
      }
    },
    onError: (error) => {
      if (config.onError) {
        config.onError(error);
      }
    },
    update: (cache, { data }) => {
      if (config.optimisticUpdate) {
        config.optimisticUpdate(cache, data);
      }
    },
  });

  const execute = async (variables) => {
    try {
      if (config.optimisticResponse) {
        // Apply optimistic response
        config.optimisticResponse(variables);
      }

      const result = await mutate({ variables });
      return result;
    } catch (error) {
      throw error;
    }
  };

  return [execute, { loading, error }]; // Return an array for consistency
};
