"use client";
import { IoAddCircle } from "react-icons/io5";
import { TextInput, Button, Label } from "flowbite-react";
import { useFieldArray } from "react-hook-form";
import OptionValues from "@/components/admin/product/OptionValues";
import VariantsTable from "./VariantsTable";
export default function VariantInputs({
  register,
  control,
  errors,
  trigger,
  watch,
  getValues,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  return (
    <div className="card p-3 flex flex-col">
      <h2>Variants</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border flex flex-col gap-4 my-2 p-3 rounded"
        >
          <div className="md:mx-auto md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor={`option-${field.id}`} value="Option name" />
            </div>
            <TextInput
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
              helperText={
                errors.options &&
                errors.options[index]?.name && (
                  <span className="text-red-500 text-sm">
                    {errors.options[index].name.message}
                  </span>
                )
              }
            />
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
            <Button size="sm" color="red" onClick={() => remove(index)}>
              Delete
            </Button>
            <Button size="sm" color="dark">
              Done
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          color="light"
          className="my-2 md:w-1/2"
          size="sm"
          onClick={() => append({ name: "" })}
        >
          <IoAddCircle className="mr-3 w-4 h-4" />
          Add options like color or size
        </Button>
      </div>
      <VariantsTable control={control} />
    </div>
  );
}
