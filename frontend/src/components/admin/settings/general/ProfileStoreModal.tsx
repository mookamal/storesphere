"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import FormField from "@/components/common/FormField";
import ButtonIcon from "@/components/common/ButtonIcon";
import { useUpdateStoreProfileMutation } from "@/codegen/generated";

interface ProfileStoreModalProps {
  data: any;
  refreshData: () => void;
}

// Define the state shape for the form
interface FormState {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileStoreModal({
  data,
  refreshData,
}: ProfileStoreModalProps): JSX.Element {
  // Cast useParams to include domain of type string
  const { domain } = useParams() as { domain: string };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.billingAddress?.phone || "",
  });

  const [updateStoreProfile, { loading }] = useUpdateStoreProfileMutation();

  // Check if any changes have been made compared to the original data
  const hasChanges =
    formState.name !== data?.name ||
    formState.email !== data?.email ||
    formState.phone !== data?.billingAddress?.phone;

  // Update the store profile by calling the mutation
  const handleSubmit = async () => {
    try {
      await updateStoreProfile({
        variables: {
          input: {
            name: formState.name,
            email: formState.email,
            billingAddress: {
              phone: formState.phone,
            },
          },
          defaultDomain: domain,
        },
      });
      toast.success("Profile updated successfully!");
      refreshData();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  // Generic field change handler for form fields
  const handleFieldChange = (field: keyof FormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ButtonIcon icon={MdEditNote} label="Edit settings" variant="default" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store Profile</DialogTitle>
          <hr />
          <DialogDescription>
            Please be aware that these details might be accessible to the
            public. Avoid using personal information.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-6">
          <div className="grid md:grid-cols-2 md:gap-6">
            <FormField
              label="Store Name"
              id="name"
              value={formState.name}
              onChange={handleFieldChange("name")}
            />

            <FormField
              label="Store Phone"
              id="phone"
              value={formState.phone}
              onChange={handleFieldChange("phone")}
            />
          </div>

          <FormField
            label="Store Email"
            id="email"
            type="email"
            value={formState.email}
            onChange={handleFieldChange("email")}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!hasChanges || loading}
          className="w-full"
        >
          {loading ? (
            <IoReload className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
