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
  PERFORM_ACTION_ON_VARIANTS,
  VariantActions,
} from "@/graphql/mutations";
import axios from "axios";
export default function DeleteVariantsDialog({
  variantIDs,
  onRefetch,
  clearSelectedVariantIDs,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDeleteClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const variables = {
      variantIds: variantIDs,
      action: VariantActions.DELETE,
    };
    try {
      // send request to server
      const response = await axios.post("/api/set-data", {
        query: PERFORM_ACTION_ON_VARIANTS,
        variables: variables,
      });
      if (response.data.data.performActionOnVariants.success) {
        toast.success(response.data.data.performActionOnVariants.message);
        onRefetch();
        setOpen(false);
        clearSelectedVariantIDs();
      }
    } catch (error) {
      toast.error("Failed to delete variants");
    } finally {
      setLoading(false);
    }
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
