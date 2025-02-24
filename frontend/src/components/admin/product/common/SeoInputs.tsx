"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cardVariants } from "@/utils/cardVariants";
import type { UseFormRegister } from "react-hook-form";
import type { ProductInput } from "@/codegen/generated";

interface SeoInputsProps {
  register: UseFormRegister<ProductInput>;
  domain: string;
  handle: string;
}

export default function SeoInputs({
  register,
  domain,
  handle,
}: SeoInputsProps): JSX.Element {
  return (
    <Card className={cardVariants.base}>
      <CardHeader className={cardVariants.header}>
        <h2 className={cardVariants.title}>SEO data</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        <div className="my-2">
          <div className="mb-2">
            <Label htmlFor="seoTitle">Page title</Label>
          </div>
          <Input
            id="seoTitle"
            type="text"
            {...register("seo.title")}
            placeholder="seo title"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            <Label htmlFor="seoDescription">Seo Description</Label>
          </div>
          <Textarea
            id="seoDescription"
            {...register("seo.description")}
            placeholder="seo description"
          />
        </div>

        <div className="my-2">
          <div className="mb-2">
            <h2>URL handle</h2>
            <Badge className="my-3">
              https://{domain}.my-store.com/{handle}
            </Badge>
          </div>
          <Input {...register("handle")} />
        </div>
      </CardContent>
    </Card>
  );
}
