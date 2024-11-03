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
import { useState, useEffect } from "react";
import axios from "axios";
import { UPDATE_STORE_PROFILE } from "@/graphql/mutations";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
export default function ProfileStoreModal({ data, refreshData }) {
  const [storeName, setStoreName] = useState(data.name || "");
  const [storePhone, setStorePhone] = useState(data.billingAddress.phone || "");
  const [storeEmail, setStoreEmail] = useState(data.email || "");
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const domain = useParams().domain;
  useEffect(() => {
    if (
      storeName !== data.name ||
      storePhone !== data.billingAddress.phone ||
      storeEmail !== data.email
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [storeName, storePhone, storeEmail, data]);

  const handleSave = async () => {
    setIsLoading(true);
    const variables = {
      input: {
        name: storeName,
        email: storeEmail,
        billingAddress: {
          phone: storePhone,
        },
      },
      defaultDomain: domain,
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: UPDATE_STORE_PROFILE,
        variables: variables,
      });

      refreshData();
      toast.success("Store profile updated successfully!");
    } catch (error) {
      if (error.response.data.error) {
        console.error(error.response.data.error);
      }
      console.error("Error updating store profile:", error.message);
      toast.error("Failed to update store profile!");
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-slate-100 p-2 rounded-md shadow flex justify-center">
        <MdEditNote size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <hr />
          <DialogDescription>
            Please be aware that these details might be accessible to the
            public. Avoid using personal information.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3">
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="w-full mb-5">
              <Label htmlFor="name" value="Store Name" />
              <Input
                id="name"
                name="name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="w-full mb-5">
              <Label htmlFor="phone" value="Store Phone" />
              <Input
                id="phone"
                name="phone"
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full mb-5">
            <Label htmlFor="email" value="Store Email" />
            <Input
              id="email"
              name="email"
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={!isChanged}>
          {isLoading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
