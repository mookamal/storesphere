"use client";

import CustomerOverview from "@/components/admin/customer/CustomerOverview";

export default function CreateCustomer() {
  return (
    <form>
      <div className="p-5">
        <h1 className="h1">New customer</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <CustomerOverview />
        </div>
      </div>
    </form>
  );
}
