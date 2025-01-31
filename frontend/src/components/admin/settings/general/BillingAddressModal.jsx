"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdEditNote } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { IoReload } from "react-icons/io5";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import { toast } from "react-toastify";
import { UPDATE_STORE_ADDRESS } from "@/graphql/mutations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from '@apollo/client';

countries.registerLocale(enLocale);

const initialFormState = {
  company: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  country: { name: '', code: '' }
};

const sanitizeData = (data) => ({
  company: data?.company || '',
  address1: data?.address1 || '',
  address2: data?.address2 || '',
  city: data?.city || '',
  zip: data?.zip || '',
  country: {
    name: data?.country?.name || '',
    code: data?.country?.code || ''
  }
});

export default function BillingAddressModal({ data, refreshData }) {
  const { domain } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(() => ({
    ...initialFormState,
    ...sanitizeData(data)
  }));

  const [updateStoreAddress, { loading }] = useMutation(UPDATE_STORE_ADDRESS, {
    onCompleted: () => {
      refreshData();
      toast.success("Billing details updated successfully!");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
      console.error("Update error:", error);
    }
  });

  const countryOptions = useMemo(() => {
    const countryNames = countries.getNames("en", { select: "official" });
    return Object.entries(countryNames).map(([code, name]) => ({
      value: code,
      label: name
    }));
  }, []);

  const hasChanges = useMemo(() => {
    const originalData = sanitizeData(data);
    return (
      formState.company !== originalData.company ||
      formState.address1 !== originalData.address1 ||
      formState.address2 !== originalData.address2 ||
      formState.city !== originalData.city ||
      formState.zip !== originalData.zip ||
      formState.country.code !== originalData.country.code
    );
  }, [formState, data]);

  const handleFieldChange = (field) => (value) => {
    setFormState(prev => ({
      ...prev,
      [field]: field === 'country' 
        ? { name: value?.label || '', code: value?.value || '' }
        : value || ''
    }));
  };

  const handleSubmit = () => {
    updateStoreAddress({
      variables: {
        input: {
          ...formState,
          country: {
            name: formState.country.name || '',
            code: formState.country.code || ''
          }
        },
        defaultDomain: domain
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-slate-100 dark:bg-black dark:text-white p-2 rounded-md shadow flex justify-center">
        <MdEditNote size={20} />
      </DialogTrigger>
      
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing Information</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Update your store's billing address and contact information
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="grid gap-4 mb-4 grid-cols-1">
          <FormField
            label="Legal business name"
            id="company"
            value={formState.company}
            onChange={handleFieldChange('company')}
          />

          <div className="w-full">
            <Label htmlFor="country">Country</Label>
            <Select
              id="country"
              options={countryOptions}
              value={{
                value: formState.country.code || '',
                label: formState.country.name || 'Select a country'
              }}
              onChange={handleFieldChange('country')}
              className="react-select-container mt-2"
              classNamePrefix="react-select"
              isSearchable
              placeholder="Select country..."
            />
          </div>

          <FormField
            label="City"
            id="city"
            value={formState.city}
            onChange={handleFieldChange('city')}
          />

          <FormField
            label="Street address"
            id="address1"
            value={formState.address1}
            onChange={handleFieldChange('address1')}
          />

          <FormField
            label="Apartment, suite, etc"
            id="address2"
            value={formState.address2}
            onChange={handleFieldChange('address2')}
          />

          <FormField
            label="Postal code"
            id="zip"
            value={formState.zip}
            onChange={handleFieldChange('zip')}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!hasChanges || loading}
          className="w-full mt-4"
        >
          {loading ? (
            <IoReload className="animate-spin mr-2 h-4 w-4" />
          ) : null}
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const FormField = ({ label, id, value, onChange, ...props }) => (
  <div className="w-full">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2"
      {...props}
    />
  </div>
);