"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VariantForm from "./VariantForm";
import VariantsTable from "./VariantsTable";
export default function VariantCard({ watch, currencyCode }) {
  const options = watch("options");
  const hasValidOptions = options && options.some((option) => option.id);
  return (
    <Card className="card">
      <CardHeader>
        <div className="flex justify-between items-center">
          Variants
          {hasValidOptions && (
            <VariantForm currencyCode={currencyCode} watch={watch} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasValidOptions ? (
          <VariantsTable />
        ) : (
          <div className="text-center">
            Set up options and values to enable variant creation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
