"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoAddCircle } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import VariantsTable from "./VariantsTable";

import EditableOption from "./option/EditableOption";
export default function VariantInputs({
  register,
  control,
  errors,
  trigger,
  watch,
  getValues,
  setValue,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const toggleEdit = (index) => {
    const nameValue = watch(`options.${index}.name`);
    const optionValue = watch(`options.${index}.values.0.name`);
    if (
      nameValue !== undefined &&
      nameValue !== "" &&
      optionValue !== undefined &&
      optionValue !== ""
    ) {
      const currentEditingState = watch(`options.${index}.isEditing`);
      setValue(`options.${index}.isEditing`, !currentEditingState);
    }
  };
  return (
    <Card className="card">
      <CardHeader>Variants</CardHeader>
      <CardContent>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border flex flex-col gap-4 my-2 p-3 rounded"
          >
            <EditableOption
              field={field}
              index={index}
              register={register}
              errors={errors}
              trigger={trigger}
              watch={watch}
              getValues={getValues}
              toggleEdit={toggleEdit}
              control={control}
              remove={remove}
            />
          </div>
        ))}
        <div className="flex justify-center">
          <Button
            className="my-2 w-full"
            size="sm"
            onClick={() => append({ name: "", isEditing: true })}
          >
            <IoAddCircle className="mr-3 w-4 h-4" />
            Add options like color or size
          </Button>
        </div>
        <VariantsTable control={control} />
      </CardContent>
    </Card>
  );
}
