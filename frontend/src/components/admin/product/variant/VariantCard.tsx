"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VariantForm from "./VariantForm";
import VariantsTable from "./VariantsTable";
import { useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { ProductInput } from "@/codegen/generated";

interface VariantCardProps {
  control: Control<ProductInput>;
  currencyCode: string;
}

export default function VariantCard({
  control,
  currencyCode,
}: VariantCardProps): JSX.Element {
  const options = useWatch({
    control,
    name: "options",
    defaultValue: [],
  });

  const optionsState = {
    isEmpty: !Array.isArray(options) || options.length === 0,
    hasValidOptions: Array.isArray(options) && options.length > 0,
  };

  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  return (
    <Card className="card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Variants</h3>
          {optionsState.hasValidOptions && (
            <VariantForm
              currencyCode={currencyCode}
              control={control}
              onVariantAdded={() => setShouldRefetch(true)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {optionsState.isEmpty ? (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">
              No options defined yet. Add product options like size, color, or
              material first.
            </p>
          </div>
        ) : optionsState.hasValidOptions ? (
          <VariantsTable
            currencyCode={currencyCode}
            shouldRefetch={shouldRefetch}
            onRefetchHandled={() => setShouldRefetch(false)}
            setShouldRefetch={setShouldRefetch}
          />
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">
              Set up options and values to enable variant creation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
