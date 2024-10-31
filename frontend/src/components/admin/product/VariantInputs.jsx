"use client";
import { IoAddCircle } from "react-icons/io5";
import { TextInput, Button, Label } from "flowbite-react";
import { useFieldArray } from "react-hook-form";

export default function VariantInputs({ register, control, errors, trigger }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  return (
    <div className="card p-3 flex flex-col h-full">
      <h2>Variants</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border flex flex-col gap-4 my-2 p-3 rounded"
        >
          <div className="mx-auto w-1/2">
            <div className="mb-2 block">
              <Label htmlFor={`option-${field.id}`} value="Option name" />
            </div>
            <TextInput
              id={`option-${field.id}`}
              {...register(`options.${index}.name`, {
                required: "Option name is required",
              })}
              placeholder="Size"
              control={control}
              color={
                errors.options && errors.options[index] ? "failure" : "default"
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
    </div>
  );
}
