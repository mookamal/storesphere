"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VariantForm from "./VariantForm";
import VariantsTable from "./VariantsTable";
import { useState } from "react";
export default function VariantCard({ watch, currencyCode }) {
  const options = watch("options");
  const hasValidOptions = options && options.some((option) => option.id);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const handleVariantAdded = () => {
    setShouldRefetch(true);
  };
  return (
    <Card className="card">
      <CardHeader>
        <div className="flex justify-between items-center">
          Variants
          {hasValidOptions && (
            <VariantForm
              currencyCode={currencyCode}
              watch={watch}
              onVariantAdded={handleVariantAdded}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasValidOptions ? (
          <VariantsTable
            currencyCode={currencyCode}
            shouldRefetch={shouldRefetch}
            onRefetchHandled={() => setShouldRefetch(false)}
            setShouldRefetch={setShouldRefetch}
          />
        ) : (
          <div className="text-center">
            Set up options and values to enable variant creation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
