import { TextInput, Label, Textarea, Badge } from "flowbite-react";
export default function SeoInputs({ register, domain, handle }) {
  return (
    <div className="card p-3 flex flex-col h-full">
      <h2>SEO data</h2>

      <div className="my-2">
        <div className="mb-2">
          <Label htmlFor="seoTitle" value="Page title" />
        </div>
        <TextInput
          id="seoTitle"
          sizing="sm"
          type="text"
          {...register("seoTitle")}
          placeholder="seo title"
        />
      </div>

      <div className="my-2">
        <div className="mb-2">
          <h2>Page description</h2>
        </div>
        <Textarea
          id="seoDescription"
          sizing="sm"
          {...register("seoDescription")}
          placeholder="seo description"
          rows={3}
        />
      </div>

      <div className="my-2">
        <div className="mb-2">
          <h2>URL handle</h2>
          <Badge size="xs" className="my-3" color="success">
            https://{domain}.my-store.com/{handle}
          </Badge>
        </div>
        <TextInput sizing="sm" {...register("handle")} />
      </div>
    </div>
  );
}
