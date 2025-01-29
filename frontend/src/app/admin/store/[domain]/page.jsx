"use client";
import { useSession } from "next-auth/react";


export default function StoreAdmin() {
  const { data: session, status } = useSession();
  return (
    <div>
    <div>Home</div>
    </div>
  );
}
