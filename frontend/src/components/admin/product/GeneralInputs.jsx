"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
const cardVariants = {
  base: `
    rounded-2xl 
    border 
    border-gray-200/50 
    bg-white 
    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] 
    overflow-hidden 
    transition-all 
    duration-300 
    hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] 
    hover:scale-[1.01] 
    active:scale-[0.99]
    dark:bg-gray-800 
    dark:border-gray-700/50
  `,
  header: `
    px-4 
    py-3 
    bg-gray-50 
    border-b 
    border-gray-200 
    flex 
    items-center 
    justify-between 
    dark:bg-gray-900/30 
    dark:border-gray-700
  `,
  content: `
    p-4 
    space-y-4 
    relative 
    before:absolute 
    before:inset-0 
    before:bg-gradient-to-br 
    before:from-transparent 
    before:to-gray-50/10 
    before:opacity-0 
    hover:before:opacity-100 
    before:transition-opacity 
    before:duration-300
  `,
  title: `
    text-sm 
    font-semibold 
    text-gray-700 
    uppercase 
    tracking-wider 
    dark:text-gray-200
  `,
  interactive: `
    cursor-pointer 
    hover:bg-gray-50 
    active:bg-gray-100 
    transition-colors 
    duration-200
  `
};
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
