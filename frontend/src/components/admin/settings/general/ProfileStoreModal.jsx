"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useState } from "react";
import { UPDATE_STORE_PROFILE } from "@/graphql/mutations";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import { useMutation } from '@apollo/client';

export default function ProfileStoreModal({ data, refreshData }) {
  const { domain } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.billingAddress?.phone || ""
  });

  const [updateStoreProfile, { loading }] = useMutation(UPDATE_STORE_PROFILE);

  const hasChanges = 
    formState.name !== data?.name ||
    formState.email !== data?.email ||
    formState.phone !== data?.billingAddress?.phone;

  const handleSubmit = async () => {
    try {
      await updateStoreProfile({
        variables: {
          input: {
            name: formState.name,
            email: formState.email,
            billingAddress: {
              phone: formState.phone
            }
          },
          defaultDomain: domain
        }
      });

      toast.success("Profile updated successfully!");
      refreshData();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  const handleFieldChange = (field) => (e) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-slate-100 dark:bg-black dark:text-white p-2 rounded-md shadow flex justify-center">
        <MdEditNote size={20} />
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store Profile</DialogTitle>
          <hr />
          <DialogDescription>
            Please be aware that these details might be accessible to the public.
            Avoid using personal information.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-6">
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="w-full mb-5">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={handleFieldChange('name')}
                className="mt-2"
              />
            </div>

            <div className="w-full mb-5">
              <Label htmlFor="phone">Store Phone</Label>
              <Input
                id="phone"
                value={formState.phone}
                onChange={handleFieldChange('phone')}
                className="mt-2"
              />
            </div>
          </div>

          <div className="w-full mb-5">
            <Label htmlFor="email">Store Email</Label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              onChange={handleFieldChange('email')}
              className="mt-2"
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!hasChanges || loading}
          className="w-full"
        >
          {loading ? (
            <IoReload className="mr-2 h-4 w-4 animate-spin" />
          ) : 'Save Changes'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}