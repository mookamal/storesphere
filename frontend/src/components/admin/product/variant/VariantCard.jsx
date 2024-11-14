"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VariantForm from "./VariantForm";
export default function VariantCard({ watch, currencyCode }) {
  const options = watch("options");
  const hasValidOptions = options && options.some((option) => option.id);

  return (
    <Card className="card">
      <CardHeader>
        <div className="flex justify-between items-center">
          Variants
          <VariantForm currencyCode={currencyCode} />
        </div>
      </CardHeader>
      <CardContent>
        {hasValidOptions ? (
          <h2>Tables variants</h2>
        ) : (
          <div className="text-center">
            Set up options and values to enable variant creation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
