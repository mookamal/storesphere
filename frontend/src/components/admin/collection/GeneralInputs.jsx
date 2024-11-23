import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GeneralInputs({ register }) {
  return (
    <Card className="card w-full md:w-[60%]">
      <CardHeader>General information</CardHeader>
      <CardContent>
        <div>
          <div className="mb">
            <Label htmlFor="title">Title</Label>
          </div>
          <Input
            id="title"
            size="sm"
            type="text"
            {...register("title")}
            required
            placeholder="Collection title (e.g., Men's Clothing)"
          />
        </div>
        <div>
          <div className="mb">
            <Label htmlFor="description">Description</Label>
          </div>
          <Textarea
            id="description"
            size="sm"
            {...register("description")}
            placeholder="Description"
          />
        </div>
      </CardContent>
    </Card>
  );
}
