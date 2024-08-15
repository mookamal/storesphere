import { getShortInitials } from "../../lib/utilities";
import { Badge } from "flowbite-react";
export default function AvatarByLetter( { storeName } ) {
  const initials = getShortInitials(storeName);
  return (
    <Badge className="p-2" >
        <span className="inline-block w-50 h-50 text-sm text-center font-bold rounded-md text-slate-900">{initials}</span>
    </Badge>
  )
}
