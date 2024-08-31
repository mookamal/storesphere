"use client";

import { Button, Modal, Label, TextInput, Spinner, Dropdown } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "react-country-state-city/dist/react-country-state-city.css";


export default function BillingAddress({ openModal, setOpenModal, data, refreshData }) {
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(data.company || "")
  const [address1, setAddress1] = useState(data.address1 || "")
  const [address2, setAddress2] = useState(data.address2 || "")
  const [city, setCity] = useState(data.city || "")
  const [postalCode, setPostalCode] = useState(data.postalCode || "")
  const [country, setCountry] = useState(data.country || {})
  const domain = useParams().domain;



  const handleSave = async () => {
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
        <span className="font-semibold text-base">Billing information</span>
      </Modal.Header>

      <Modal.Body className="dark:bg-slate-900">
        <div className="grid gap-4 mb-4 grid-cols-1">

          <div>
            <div className="mb-2">
              <Label htmlFor="company" value="Legal business name" />
            </div>
            <TextInput id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div>
            <div className="mb-2">
              <Label htmlFor="country" value="Country" />
            </div>

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
