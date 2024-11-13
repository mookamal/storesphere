"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoAddCircle } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import { usePathname } from "next/navigation";
import EditableOption from "./EditableOption";

export default function OptionInputs({
  register,
  control,
  errors,
  trigger,
  watch,
  getValues,
  setValue,
}) {
  const pathname = usePathname();
  const isAddPage = pathname.endsWith("/new");
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
        {isAddPage && (
          <h3 className="font-bold text-center mt-4 text-yellow-400">
            Please save the product before adding variants.
          </h3>
        )}
      </CardContent>
    </Card>
  );
}
