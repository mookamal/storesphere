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
import { MdEditNote } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Select from "react-select";
import { UPDATE_STORE_CURRENCY } from "@/graphql/mutations";
import axios from "axios";
import { toast } from "react-toastify";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
let data = require("currency-codes/data");
let cc = require("currency-codes");
export default function StoreCurrencyModel({ currencyCode, refreshData }) {
  const domain = useParams().domain;
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [code, setCode] = useState(currencyCode || "");
  const optionCurrency = [];

  data.forEach((currency) => {
    optionCurrency.push({ value: currency.code, label: currency.currency });
  });

  useEffect(() => {
    if (code !== currencyCode) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [code]);

  const handleSave = async () => {
    setIsLoading(true);
    const variables = {
      input: {
        currencyCode: code,
      },
      defaultDomain: domain,
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: UPDATE_STORE_CURRENCY,
        variables: variables,
      });

      refreshData();
      toast.success("Store currency updated successfully!");
    } catch (error) {
      if (error.response.data.error) {
        console.error(error.response.data.error);
      }
      console.error("Error updating store currency:", error.message);
      toast.error("Failed to update store currency!");
    }
    // save data to API
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-slate-100 dark:bg-black dark:text-white p-2 rounded-md shadow flex justify-center">
        <MdEditNote size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change store currency</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>Change store currency</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Select
          options={optionCurrency}
          value={{ value: code, label: cc.code(code).currency }}
          onChange={(e) => {
            setCode(e.value);
          }}
          id="country"
          classNames={{
            option: ({ isFocused, isSelected }) =>
              `${isFocused ? "dark:bg-blue-100" : ""} ${
                isSelected ? "dark:bg-blue-500 dark:text-white" : ""
              } dark:text-gray-800`,
          }}
        />
        <Button onClick={handleSave} disabled={!isChanged}>
          {isLoading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
