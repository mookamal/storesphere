"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function VariantCard({ watch }) {
  const options = watch("options");
  const hasValidOptions = options && options.some((option) => option.id);

  return (
    <Card className="card">
      <CardHeader>Variants</CardHeader>
      <CardContent>
        {hasValidOptions ? (
          <h2>hasValidOptions</h2>
        ) : (
          <div className="text-center">
            Set up options and values to enable variant creation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
