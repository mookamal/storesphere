"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const CustomEditor = dynamic(() => import("@/components/custom-editor"), {
  ssr: false,
});
export default function GeneralInputs({
  register,
  handleBlur,
  setValue,
  description,
}) {
  const handleEditorChange = (content) => {
    setValue("description", content);
  };
  return (
    <Card className="bg-gray-100 dark:bg-slate-900 shadow-md border-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          General information
          <select
            defaultValue="ACTIVE"
            {...register("status")}
            id="status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[85px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <div className="mb-2">
            <Label htmlFor="title">Title</Label>
          </div>
          <Input
            id="title"
            size="sm"
            type="text"
            {...register("title")}
            placeholder="Product 1"
            onBlur={handleBlur}
            required
          />
        </div>
        <div className="my-2">
          <div className="mb-2">
            <h2>Description</h2>
          </div>
          {/* CustomEditor with description */}
          <CustomEditor content={description} setContent={handleEditorChange} />
        </div>
      </CardContent>
    </Card>
  );
}
