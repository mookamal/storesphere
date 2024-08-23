"use client";

import { IoMdHome } from "react-icons/io";
import { MdEditNote } from "react-icons/md";
import { useState } from "react";
import ProfileStoreModal from "@/components/admin/settings/general/ProfileStoreModal";
import { useSuspenseQuery , gql  } from "@apollo/client";
const GET_STORE_DETAILS = gql`
  query GetStoreDetails($domain: String!) {
    storeDetails(domain: $domain) {
      name
      phone
      email
      domain
    }
  }
`;

export default function General() {
  const { data } = useSuspenseQuery(GET_STORE_DETAILS, {
    variables: { domain: "a654p" },
    context: {
      // example of setting the headers with context per operation
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1MDQ5ODE5LCJpYXQiOjE3MjQ0NDUwMTksImp0aSI6Ijc3ODczZThjZTE0NTQwNDg4NTBmNzY4ODhmZmM0YjA2IiwidXNlcl9pZCI6NjB9.1kzmckaz_IoDlz42CXMzc1v7sO7WFOBLU24Yr_7q8UE"
      }
    }});
    console.log("data",data);
  const [openProfileStoreModal, setOpenProfileStoreModal] = useState(false);
  return (
    <div className="lg:w-4/6 w-full">
      {/* title */}
      <h1 className="h1">General</h1>
      {/* store details */}
      <div className="card p-3 font-medium text-sm my-3">
        <h2>Store details</h2>
        <div className="border p-3 my-3 rounded-lg">
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IoMdHome size={24} className="mr-3 text-gray-500 dark:text-gray-50" />
                <h2>My store</h2>
              </div>
              <button className="p-1 active-click" onClick={() => setOpenProfileStoreModal(true)}><MdEditNote size={24} className="text-gray-500 dark:text-gray-50" /></button>
              <ProfileStoreModal openModal={openProfileStoreModal} setOpenModal={setOpenProfileStoreModal} />
          </div>
        </div>
      </div>
    </div>
  )
}
