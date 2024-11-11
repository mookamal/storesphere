"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoAddCircle } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import OptionValues from "@/components/admin/product/option/OptionValues";
import VariantsTable from "./VariantsTable";
import { Button } from "@/components/ui/button";
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
    <Card className="bg-gray-100 dark:bg-slate-900 shadow-md border-1">
      <CardHeader>Variants</CardHeader>
      <CardContent>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border flex flex-col gap-4 my-2 p-3 rounded"
          >
            <div className="md:mx-auto md:w-1/2">
              <div className="mb-2 block">
                <Label htmlFor={`option-${field.id}`}>Option name</Label>
              </div>
              <Input
                id={`option-${field.id}`}
                {...register(`options.${index}.name`, {
                  required: "Option name is required",
                  validate: {
                    unique: (value) => {
                      const values = getValues().options.map(
                        (option) => option.name
                      );
                      const isDuplicate =
                        values.filter((v) => v === value).length > 1;
                      return !isDuplicate || "This value must be unique";
                    },
                  },
                })}
                placeholder="Size"
                control={control}
                color={
                  errors.options && errors.options[index] ? "failure" : "gray"
                }
                onBlur={() => trigger(`options.${index}.name`)}
              />
              {errors.options && errors.options[index]?.name && (
                <span className="text-red-500 text-sm">
                  {errors.options[index].name.message}
                </span>
              )}
            </div>
            {/* Nested field array for option values */}
            <div className="md:mx-auto md:w-1/2 mt-4">
              <OptionValues
                control={control}
                register={register}
                errors={errors}
                optionIndex={index}
                trigger={trigger}
                getValues={getValues}
              />
            </div>
            <hr />
            <div className="flex justify-between mx-auto w-1/2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => toggleEdit(index)}
              >
                Done
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <Button
            className="my-2 w-full"
            size="sm"
            onClick={() => append({ name: "" })}
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
