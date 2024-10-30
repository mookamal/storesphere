import { Label, Select } from "flowbite-react";
export default function Status({ register }) {
  return (
    <div className="card p-3">
      <div className="mb-2">
        <Label htmlFor="status" value="Status" />
      </div>
      <Select sizing="sm" id="status" {...register("status")}>
        <option value="ACTIVE">Active</option>
        <option value="DRAFT">Draft</option>
      </Select>
    </div>
  );
}
