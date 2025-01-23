"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {cardVariants } from "@/utils/cardVariants"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
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
    <Card className={cardVariants.base}>
    <CardHeader className={cardVariants.header}>
      <div className="flex justify-between items-center w-full">
        <CardTitle className={cardVariants.title}>
          General Information
        </CardTitle>
        <Select {...register("status")} defaultValue="ACTIVE">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
      <CardContent className={cardVariants.content}>
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
