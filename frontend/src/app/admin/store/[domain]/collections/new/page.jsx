"use client";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import { ADMIN_CREATE_COLLECTION } from "@/graphql/mutations";
import { useParams, useRouter } from "next/navigation";
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import useCollectionSubmit from "@/hooks/collection/useCollectionSubmit";

export default function CreateCollection() {
  const domain = useParams().domain;
  const router = useRouter();


  const { 
    image, 
    register, 
    handleSubmit, 
    handleBlur, 
    watch, 
    setImage 
  } = useCollectionForm();

  const handle = watch("handle");
  const { submitCollection, loading, setLoading } = useCollectionSubmit(
    ADMIN_CREATE_COLLECTION, 
    (data) => {
      router.push(`/store/${domain}/collections/${data.createCollection.collection.collectionId}`);
    }, 
    domain
  );
  const onSubmit = (data) => {
    submitCollection(data, image);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new collection</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            setImage={setImage}
            image={image}
          />

          <h2 className="font-bold text-orange-400 my-3">
            You need to save the collection before adding products to it.
          </h2>

          <SeoInputs register={register} domain={domain} handle={handle} />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={loading}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Add
      </Button>
    </form>
  );
}
