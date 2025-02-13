"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonIcon from '@/components/common/ButtonIcon';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Select from "react-select";
import { UPDATE_STORE_PROFILE } from "@/graphql/mutations";
import { toast } from "react-toastify";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from '@apollo/client';
import cc from "currency-codes";
import data from "currency-codes/data";

export default function StoreCurrencyModel({ currencyCode, refreshData }) {
  const { domain } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => 
    currencyCode ? { 
      value: currencyCode, 
      label: cc.code(currencyCode)?.currency || currencyCode 
    } : null
  );

  const [updateStoreCurrency, { loading }] = useMutation(UPDATE_STORE_PROFILE, {
    onCompleted: () => {
      refreshData();
      toast.success("Store currency updated successfully!");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update currency: ${error.message}`);
      console.error("Currency update error:", error);
    }
  });

  const currencyOptions = useMemo(() => 
    data.map(currency => ({
      value: currency.code,
      label: `${currency.currency} (${currency.code})`
    })),
    []
  );

  const hasChanges = useMemo(
    () => selectedCurrency?.value !== currencyCode,
    [selectedCurrency, currencyCode]
  );

  const handleSubmit = () => {
    if (!hasChanges) return;
    
    updateStoreCurrency({
      variables: {
        input: { currencyCode: selectedCurrency.value },
        defaultDomain: domain
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ButtonIcon
          icon={MdEditNote}
          label="Edit settings"
          variant="default"
        />
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Store Currency</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Select the primary currency for your store transactions
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-4">
          <div className="form-field">
            <Label htmlFor="currency-select">Store Currency</Label>
            <Select
              id="currency-select"
              options={currencyOptions}
              value={selectedCurrency}
              onChange={setSelectedCurrency}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select currency..."
              isSearchable
              isLoading={loading}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!hasChanges || loading}
            className="w-full"
          >
            {loading ? (
              <IoReload className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}