// Custom hook for handling collection submission
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function useCollectionSubmit(
  submitMutation, 
  successCallback, 
  domain, 
  collectionId = null
) {
  const [loading, setLoading] = useState(false);

  const submitCollection = async (data, image) => {
    setLoading(true);
    try {
      const variables = {
        domain,
        collectionInputs: {
          title: data.title,
          handle: data.handle,
          description: data.description,
          imageId: image ? image.imageId : null,
          seo: {
            title: data.seoTitle,
            description: data.seoDescription,
          },
        },
        ...(collectionId && { collectionId }) // Conditional ID for update
      };

      const response = await axios.post("/api/set-data", {
        query: submitMutation,
        variables
      });

      if (response.data.data) {
        toast.success('Collection saved successfully!');
        successCallback(response.data.data);
      }
    } catch (error) {
      console.error('Collection submission error', error);
      toast.error('Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  return { submitCollection, loading,setLoading };
}

export default useCollectionSubmit;