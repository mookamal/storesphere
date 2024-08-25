"use client";

import { IoMdHome } from "react-icons/io";
import { MdEditNote } from "react-icons/md";
import { useEffect, useState } from "react";
import ProfileStoreModal from "@/components/admin/settings/general/ProfileStoreModal";
import axios from 'axios';
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import { usePathname } from 'next/navigation'

export default function General() {
  const [openProfileStoreModal, setOpenProfileStoreModal] = useState(false);
  const domain = usePathname().split('/')[2];

  const getData = async () => {
    try {
      const response = await axios.post('/api/get-data', {
        query: GET_SETTINGS_GENERAL,
        variables: { domain: domain },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching store details:', error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);



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
