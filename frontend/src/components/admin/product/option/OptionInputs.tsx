"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoAddCircle } from "react-icons/io5";
import { useFieldArray } from "react-hook-form";
import { usePathname } from "next/navigation";
import EditableOption from "./EditableOption";
import { cardVariants } from "@/utils/cardVariants";
import { useState } from "react";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
  UseFormWatch,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { ProductInput } from "@/codegen/generated";

// Define the props for the OptionInputs component.
interface OptionInputsProps {
  register: UseFormRegister<ProductInput>;
  control: Control<ProductInput>;
  errors: FieldErrors<ProductInput>;
  trigger: UseFormTrigger<ProductInput>;
  watch: UseFormWatch<ProductInput>;
  getValues: UseFormGetValues<ProductInput>;
  setValue: UseFormSetValue<ProductInput>;
}

export default function OptionInputs({
  register,
  control,
  errors,
  trigger,
  watch,
  getValues,
  setValue,
}: OptionInputsProps): JSX.Element {
  const pathname = usePathname();
  const isAddPage = pathname.endsWith("/new");

  // Set up the field array for options.
  const { fields, append, remove } = useFieldArray<ProductInput>({
    control,
    name: "options",
  });
  const [editingStates, setEditingStates] = useState<Record<number, boolean>>(
    {}
  );

  // Toggle the editing state for an option.
  const toggleEdit = (index: number): void => {
    const nameValue = watch(`options.${index}.name`);
    const optionValue = watch(`options.${index}.values.0.name`);
    if (
      nameValue !== undefined &&
      nameValue !== "" &&
      optionValue !== undefined &&
      optionValue !== ""
    ) {
      setEditingStates((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  return (
    <Card className={cardVariants.base}>
      <CardHeader className={cardVariants.header}>
        <h2 className={cardVariants.title}>Options</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
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
              isEditing={editingStates[index]}
            />
          </div>
        ))}
        <div className="flex justify-center">
          <Button
            className="my-2 w-full"
            size="sm"
            type="button"
            onClick={() => {
              append({ name: "", values: [] });
              setEditingStates((prev) => ({ ...prev, [fields.length]: true }));
            }}
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
