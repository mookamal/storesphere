"use client";

import { Button, Modal, Label, TextInput } from "flowbite-react";
import { useState } from "react";

export default function ProfileStoreModal({ openModal, setOpenModal }) {
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

  const handleSave = () => {
    // Implement save logic here
    console.log("Store Name:", storeName);
    console.log("Store Phone:", storePhone);
    setOpenModal(false);
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

      <Modal.Body>
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

      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
