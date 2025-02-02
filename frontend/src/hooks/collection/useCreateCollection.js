import { useMutation } from '@apollo/client';
import { ADMIN_CREATE_COLLECTION } from '@/graphql/mutations';
import { toast } from 'react-toastify';

export const useCreateCollection = (domain, onSuccess) => {
  const [mutate, { loading }] = useMutation(ADMIN_CREATE_COLLECTION, {
    onCompleted: (data) => {
      toast.success('Collection created successfully');
      onSuccess(data.createCollection.collection.collectionId);
    },
    onError: (error) => {
      const message = error.message.includes('Unique constraint') 
        ? 'Handle already exists' 
        : 'Failed to create collection';
      toast.error(message);
    }
  });

  const createCollection = (variables) => mutate({ variables });

  return { createCollection, loading };
};