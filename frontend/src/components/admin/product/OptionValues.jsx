import { useFieldArray } from "react-hook-form";
import { TextInput, Button, Label } from "flowbite-react";
export default function OptionValues({
  control,
  register,
  errors,
  optionIndex,
  trigger,
}) {
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  return (
    <div>
      {valueFields.map((value, valueIndex) => (
        <div key={value.id} className=" my-2">
          <div className="my-2">
            <div className="mb-2 block">
              <Label
                htmlFor={`options.${optionIndex}.values.${valueIndex}.value`}
              >
                Option Value
              </Label>
            </div>

            <TextInput
              {...register(
                `options.${optionIndex}.values.${valueIndex}.value`,
                {
                  required: "Option value is required",
                }
              )}
              placeholder="Option Value"
              id={`options.${optionIndex}.values.${valueIndex}.value`}
              onBlur={() =>
                trigger(`options.${optionIndex}.values.${valueIndex}.value`)
              }
              helperText={
                errors.options?.[optionIndex].values?.[valueIndex]?.value
                  ? errors.options?.[optionIndex].values?.[valueIndex]?.value
                      .message
                  : ""
              }
            />
          </div>

          <Button size="sm" color="red" onClick={() => removeValue(valueIndex)}>
            Remove
          </Button>
        </div>
      ))}

      <Button
        color="light"
        size="sm"
        onClick={() => appendValue({ value: "" })}
        className="mt-2"
      >
        Add Option Value
      </Button>
    </div>
  );
}
