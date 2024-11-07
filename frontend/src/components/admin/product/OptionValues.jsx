"use client";
import { useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

export default function OptionValues({
  control,
  register,
  errors,
  optionIndex,
  trigger,
  getValues,
}) {
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  const handleAddValue = (e) => {
    appendValue({ value: "" });
  };

  useEffect(() => {
    if (valueFields.length === 0) {
      appendValue({ value: "" });
    }
  }, []);

  return (
    <div>
      {valueFields.map((value, valueIndex) => (
        <div key={value.id} className="my-2">
          <div className="my-2">
            <div className="mb-2 block">
              <Label
                htmlFor={`options.${optionIndex}.values.${valueIndex}.value`}
              >
                Option Value
              </Label>
            </div>

            <div className="relative">
              <Input
                {...register(
                  `options.${optionIndex}.values.${valueIndex}.value`,
                  {
                    required: "Option value is required",
                    validate: {
                      unique: (value) => {
                        const valuesByOption = getValues(
                          `options.${optionIndex}.values`
                        );
                        // Check for duplicates while excluding the current value being validated
                        const isDuplicate = valuesByOption.some(
                          (v, index) =>
                            index !== valueIndex && v.value === value
                        );
                        return !isDuplicate || "Value already exists";
                      },
                    },
                  }
                )}
                placeholder="Option Value"
                id={`options.${optionIndex}.values.${valueIndex}.value`}
                onBlur={() =>
                  trigger(`options.${optionIndex}.values.${valueIndex}.value`)
                }
              />
              {valueIndex && valueIndex != 0 ? (
                <Button
                  size="sm"
                  onClick={() => removeValue(valueIndex)}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                >
                  <MdDeleteForever />
                </Button>
              ) : (
                ""
              )}
            </div>

            {errors.options?.[optionIndex]?.values?.[valueIndex]?.value ? (
              <p className="text-red-400">
                {
                  errors.options?.[optionIndex]?.values?.[valueIndex]?.value
                    .message
                }
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
      <Button size="sm" onClick={handleAddValue} className="mb-2">
        <IoMdAddCircle />
      </Button>
    </div>
  );
}
