"use client";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
export default function VariantsTable({ control }) {
  const [showTable, setShowTable] = useState(false);

  const watchOptions = useWatch({ control, name: "options" });

  useEffect(() => {
    const hasOption =
      Array.isArray(watchOptions) &&
      watchOptions.some((option) => option?.name?.trim());
    if (hasOption) {
      const valuesOption = watchOptions[0]?.values;
    }
  }, [watchOptions]);

  return <>{showTable && <h1>Tables</h1>}</>;
}
