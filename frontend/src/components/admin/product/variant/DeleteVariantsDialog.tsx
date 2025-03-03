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
import {
  usePerformActionOnVariantsMutation,
  VariantActions,
} from "@/codegen/generated";
import { useParams } from "next/navigation";
import React from "react";

interface DeleteVariantsDialogProps {
  variantIDs: string[];
  onRefetch: () => void;
  clearSelectedVariantIDs: () => void;
}

export default function DeleteVariantsDialog({
  variantIDs,
  onRefetch,
  clearSelectedVariantIDs,
}: DeleteVariantsDialogProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams() as { domain: string };
  const domain = params.domain;

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

  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    const variables = {
      variantIds: variantIDs,
      action: VariantActions.Delete,
      defaultDomain: domain,
    };
    await performActionOnVariants({ variables });
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
          <AlertDialogAction onClick={handleDeleteClick}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
