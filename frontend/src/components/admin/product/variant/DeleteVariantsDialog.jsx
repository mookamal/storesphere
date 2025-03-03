"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import LoadingElement from "@/components/LoadingElement";
import { VariantActions } from "@/graphql/mutations";
import { usePerformActionOnVariantsMutation } from "@/codegen/generated";
import { useParams } from "next/navigation";
export default function DeleteVariantsDialog({
  variantIDs,
  onRefetch,
  clearSelectedVariantIDs,
}) {
  const [open, setOpen] = useState(false);
  const domain = useParams().domain;

  const [performActionOnVariants, { loading }] =
    usePerformActionOnVariantsMutation({
      onCompleted: () => {
        toast.success("Variants deleted successfully");
        onRefetch();
        clearSelectedVariantIDs();
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to delete variants");
      },
    });
  const handleDeleteClick = async (e) => {
    e.preventDefault();
    const variables = {
      variantIds: variantIDs,
      action: VariantActions.DELETE,
      defaultDomain: domain,
    };
    performActionOnVariants({
      variables: variables,
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        {loading && <LoadingElement />}
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the selected variants? This action
            cannot be undone. ({variantIDs.length}) variants
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDeleteClick(e)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
