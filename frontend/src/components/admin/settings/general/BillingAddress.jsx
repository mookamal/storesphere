"use client";

import { Button, Modal, Label, TextInput, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';

export default function BillingAddress({ openModal, setOpenModal, data , refreshData }) {
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
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
