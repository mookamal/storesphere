"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function UpdateCustomer() {
  const customerId = useParams().id;
  const domain = useParams().domain;
  const [loading, setLoading] = useState(false);

  return <div>{customerId}</div>;
}
