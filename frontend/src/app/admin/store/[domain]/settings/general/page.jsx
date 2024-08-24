"use client";

import { fetchAccessToken } from '@/lib/utilities';
import { IoMdHome } from "react-icons/io";
import { MdEditNote } from "react-icons/md";
import { useState } from "react";
import ProfileStoreModal from "@/components/admin/settings/general/ProfileStoreModal";
import { useSuspenseQuery   } from "@apollo/client";
import { GET_STORE_DETAILS } from "@/graphql/queries";

export default function General() {
  
  // const { data } = useSuspenseQuery(GET_STORE_DETAILS, {
  //   variables: { domain: "a654p" },
  //   context: {
  //     // example of setting the headers with context per operation
  //     headers: {
  //       Authorization: `Bearer ${session?.access_token}`,
  //     }
  //   }});
  //   console.log("datas",data , status );
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
