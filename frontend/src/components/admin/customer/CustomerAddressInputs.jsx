"use client";
import "react-phone-number-input/style.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller } from "react-hook-form";
import { MdEditNote } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
countries.registerLocale(enLocale);
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useState } from "react";
export default function CustomerAddressInputs({
  register,
  control,
  setValue,
  watchAddress,
}) {
  const [error, setError] = useState(null);
  const countryObj = countries.getNames("en", { select: "official" });
  const countryList = Object.entries(countryObj);
  const optionCountries = [];
  for (let i = 0; i < countryList.length; i++) {
    optionCountries.push({
      value: countryList[i][0],
      label: countryList[i][1],
    });
  }

  const handlePhoneNumber = (number) => {
    if (number) {
      setError(null);
      if (isValidPhoneNumber(number)) {
        setValue("defaultAddress.phone", number);
      } else {
        setError("Invalid phone number");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-slate-100 dark:bg-black dark:text-white p-2 rounded-md shadow flex justify-center">
        <MdEditNote size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Address</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>Address</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="grid gap-4 mb-4 grid-cols-1">
          {/* company */}
          <div>
            <div className="mb-2">
              <Label htmlFor="company">Legal business name</Label>
            </div>
            <Input id="company" {...register("defaultAddress.company")} />
          </div>
          {/* Country */}
          <div>
            <div className="mb-2">
              <Label htmlFor="country">Country</Label>
            </div>
            <Controller
              control={control}
              name="defaultAddress.country"
              render={({ field }) => (
                <Select
                  inputRef={field.ref}
                  options={optionCountries}
                  id="country"
                  value={optionCountries.find(
                    (option) => option.value === field.value?.code
                  )}
                  onChange={(e) =>
                    field.onChange({ name: e.label, code: e.value })
                  }
                  classNames={{
                    option: ({ isFocused, isSelected }) =>
                      `${isFocused ? "dark:bg-blue-100" : ""} ${
                        isSelected ? "dark:bg-blue-500 dark:text-white" : ""
                      } dark:text-gray-800`,
                  }}
                />
              )}
            />
          </div>
          {/* city */}
          <div>
            <div className="mb-2">
              <Label htmlFor="city">City</Label>
            </div>
            <Input id="city" {...register("defaultAddress.city")} />
          </div>
          {/* address1 */}
          <div>
            <div className="mb-2">
              <Label htmlFor="address1">Address</Label>
            </div>
            <Input id="address1" {...register("defaultAddress.address1")} />
          </div>
          {/* address2 */}

          <div>
            <div className="mb-2">
              <Label htmlFor="address2">Apartment, suite, etc</Label>
            </div>
            <Input id="address2" {...register("defaultAddress.address2")} />
          </div>
          {/* postalCode */}
          <div>
            <div className="mb-2">
              <Label htmlFor="zip">Postal code</Label>
            </div>
            <Input id="zip" {...register("defaultAddress.zip")} />
          </div>
          {/* phone number */}
          <div className="mt-3">
            <div className="mb-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
            </div>
            <PhoneInput
              value={watchAddress?.phone}
              id="phoneNumber"
              size="sm"
              name="phoneNumber"
              placeholder="Enter phone number"
              required
              defaultCountry="US"
              onChange={handlePhoneNumber}
            />
          </div>
        </div>
        <DialogFooter>
          {/* show error */}
          {error && <p className="text-red-500">{error}</p>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
