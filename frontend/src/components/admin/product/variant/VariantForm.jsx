import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
export default function VariantForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add variant</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>
              Add a new variant to your product. Variants are used to customize
              the appearance and behavior of different products.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <DialogFooter>
          <Button type="button">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
