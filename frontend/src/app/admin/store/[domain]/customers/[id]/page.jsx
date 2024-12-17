"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function UpdateCustomer() {
  const customerId = useParams().id;
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [customer, setCustomer] = useState(null);

  return <div>{customerId}</div>;
}
