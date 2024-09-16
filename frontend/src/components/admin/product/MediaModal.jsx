"use client";

import { Button, Modal, Spinner, FileInput, Label } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
export default function MediaModal({ openModal, setOpenModal }) {
  const domain = useParams().domain;
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    uploadImage(e.target.files[0]);
  };

  const uploadImage = async (selectedFile) => {
    console.log("start!");
    if (!selectedFile) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("domain", domain);
    try {
      const response = await axios.post(`/api/product/upload-image`, formData);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleSave = async () => {};
  return (
    <Modal
      dismissible
      className="dark:text-white"
      show={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header className="bg-screen-primary dark:bg-black p-3">
        <span className="font-semibold text-base">Select file</span>
      </Modal.Header>

      <Modal.Body className="dark:bg-slate-900">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-center">
            <Label
              htmlFor="dropzone-file"
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-4 pt-3">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <FileInput
                id="dropzone-file"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-screen-primary dark:bg-black p-3">
        <Button color="dark" onClick={handleSave} size="xs">
          {loading && (
            <Spinner aria-label="Loading button" className="mr-1" size="xs" />
          )}
          Save
        </Button>

        <Button color="light" size="xs" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
