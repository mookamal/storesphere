import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export default function SeoInputs({ register, domain, handle }) {
  return (
    <Card className="card w-full md:w-[60%]">
      <CardHeader>SEO data</CardHeader>
      <CardContent>
        <div className="my-2">
          <div className="mb-2">
            <Label htmlFor="seoTitle">Page title</Label>
          </div>
          <Input
            id="seoTitle"
            size="sm"
            type="text"
            {...register("seoTitle")}
            placeholder="seo title"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            <Label htmlFor="seoDescription">Seo Description</Label>
          </div>
          <Textarea
            id="seoDescription"
            size="sm"
            {...register("seoDescription")}
            placeholder="seo description"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            <h2>URL handle</h2>
            <Badge size="xs" className="my-3">
              https://{domain}.my-store.com/collections/{handle}
            </Badge>
          </div>
          <Input size="sm" {...register("handle")} />
        </div>
      </CardContent>
    </Card>
  );
}
