import OptionValues from "@/components/admin/product/option/OptionValues";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BiEdit } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
export default function EditableOption({
  field,
  index,
  register,
  errors,
  trigger,
  watch,
  getValues,
  toggleEdit,
  control,
  remove,
}) {
  const isEditing = watch(`options.${index}.isEditing`);
  const optionName = watch(`options.${index}.name`);
  const optionValues = watch(`options.${index}.values`);
  return (
    <>
      {isEditing ? (
        <>
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
        </>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold">{optionName}</h3>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => toggleEdit(index)}
            >
              <BiEdit />
            </Button>
          </div>
          <div className="flex gap-1">
            {/* for on optionValues to show value not use input */}
            {optionValues.map((value, valueIndex) => (
              <div key={valueIndex}>
                <Badge variant="outline">{value.name}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
