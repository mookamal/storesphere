"use client";

import { Button, Modal, Label, TextInput, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { UPDATE_STORE_PROFILE } from "@/graphql/mutations";
import { useParams } from "next/navigation";


export default function ProfileStoreModal({ openModal, setOpenModal, data , refreshData }) {
  const [storeName, setStoreName] = useState(data.name || '');
  const [storePhone, setStorePhone] = useState(data.billingAddress.phone || '');
  const [storeEmail, setStoreEmail] = useState(data.email || '');
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const domain = useParams().domain;
  useEffect(() => {
    if (
      storeName !== data.name ||
      storePhone !== data.billingAddress.phone ||
      storeEmail !== data.email
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [storeName, storePhone, storeEmail, data]);


  const handleSave = async () => {
    setLoading(true);
    const variables = {
      input: {
        name: storeName,
        email: storeEmail,
        billingAddress: {
          phone: storePhone
        }
      },
      defaultDomain: domain
    };
    try {
      const response = await axios.post('/api/set-data', {
        query: UPDATE_STORE_PROFILE,
        variables: variables
      },);

      refreshData();
      setOpenModal(false);


    } catch (error) {
      if (error.response.data.error) {
        console.error(error.response.data.error);
      }
      console.error('Error updating store profile:', error.message);
    }
    setLoading(false);
  };

  return (
    <Modal
      dismissible
      className="dark:text-white"
      show={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header className="bg-screen-primary dark:bg-black p-3">
        <span className="font-semibold text-base">Edit Profile</span>
      </Modal.Header>

      <Modal.Body className="dark:bg-slate-900">
        <p className="text-sm">
          Please be aware that these details might be accessible to the public.
          Avoid using personal information.
        </p>

        <div className="mt-3">
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="w-full mb-5">
              <Label htmlFor="name" value="Store Name" />
              <TextInput
                id="name"
                name="name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="w-full mb-5">
              <Label htmlFor="phone" value="Store Phone" />
              <TextInput
                id="phone"
                name="phone"
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full mb-5">
            <Label htmlFor="email" value="Store Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-screen-primary dark:bg-black p-3">

        <Button color="dark" onClick={handleSave} size="xs" disabled={!isChanged}>
          {loading && <Spinner aria-label="Loading button" className="mr-1" size="xs" />}
          Save
        </Button>

        <Button color="light" size="xs" onClick={() => setOpenModal(false)}>Cancel</Button>

      </Modal.Footer>
    </Modal>
  );
}
