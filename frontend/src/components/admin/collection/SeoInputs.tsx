import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cardVariants } from "@/utils/cardVariants";
import React from "react";


// Define the interface for the component props
interface SeoInputsProps {
  register: any;
  domain: string;
  handle: string;
}

export default function SeoInputs({
  register,
  domain,
  handle,
}: SeoInputsProps): JSX.Element {
  return (
    <Card className={`${cardVariants.base} w-full md:w-[60%]`}>
      <CardHeader className={cardVariants.header}>
        {/* SEO data header */}
        <h2 className={cardVariants.title}>SEO data</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        <div className="my-2">
          <div className="mb-2">
            {/* Label for the SEO title input */}
            <Label htmlFor="seoTitle">Page title</Label>
          </div>
          <Input
            id="seoTitle"
            size="sm"
            type="text"
            {...register("seo.title")}
            placeholder="seo title"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            {/* Label for the SEO description textarea */}
            <Label htmlFor="seoDescription">Seo Description</Label>
          </div>
          <Textarea
            id="seoDescription"
            size="sm"
            {...register("seo.description")}
            placeholder="seo description"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            {/* Display the URL handle */}
            <h2>URL handle</h2>
            <Badge className="my-3">
              https://{domain}.my-store.com/collections/{handle}
            </Badge>
          </div>
          {/* Input for the handle */}
          <Input size="sm" {...register("handle")} />
        </div>
      </CardContent>
    </Card>
  );
}
