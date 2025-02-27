"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VariantForm from "./VariantForm";
import VariantsTable from "./VariantsTable";
import { useState } from "react";
import { useWatch } from "react-hook-form";

interface VariantCardProps {
  control: any;
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

  const hasValidOptions =
    options && options.some((option) => option?.id != null);

  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  return (
    <Card className="card">
      <CardHeader>
        <div className="flex justify-between items-center">
          Variants
          {hasValidOptions && (
            <VariantForm
              currencyCode={currencyCode}
              control={control}
              onVariantAdded={() => setShouldRefetch(true)}
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
