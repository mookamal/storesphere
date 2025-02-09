import { memo } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  loading?: boolean;
}

const SubmitButton = memo(({ loading }: SubmitButtonProps) => (
  <Button
    size="lg"
    type="submit"
    className="fixed bottom-5 right-5 rounded-full shadow-md"
    disabled={loading}
  >
    {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
    Add
  </Button>
));

export default SubmitButton;
