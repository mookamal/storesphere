"use client";

import {
  Button,
  Modal,
  Spinner,
  FileInput,
  Label,
  HR,
  Checkbox,
} from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { GET_MEDIA_IMAGES } from "@/graphql/queries";
export default function MediaModal({
  openModal,
  setOpenModal,
  selectedImages,
  setSelectedImages,
}) {
  const domain = useParams().domain;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const uploadImage = async (selectedFile) => {
    const allowedExtensions = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
    ];
    if (!selectedFile) {
      return;
    }
    if (!allowedExtensions.includes(selectedFile.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, SVG, and GIF are allowed."
      );
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("domain", domain);
    try {
      const response = await axios.post(`/api/product/upload-image`, formData);
      if (response.statusText === "OK") {
        const image = response.data;
        setSelectedImages([
          ...selectedImages,
          { id: image.id, image: image.image },
        ]);
        toast.success("Image uploaded successfully!");
        getData();
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
    setLoading(false);
  };
  const getData = async () => {
    try {
      const response = await axios.post("/api/get-data", {
        query: GET_MEDIA_IMAGES,
        variables: { domain: domain },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setData(response.data.allMediaImages);
    } catch (error) {
      console.error("Error fetching store details:", error.message);
      setData(null);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleCheckboxChange = (image, isChecked) => {
    if (isChecked) {
      setSelectedImages((prevSelectedImages) => [
        ...prevSelectedImages,
        { id: image.id, image: image.image },
      ]);
    } else {
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter(
          (selectedImage) => selectedImage.id !== image.id
        )
      );
    }
  };

  const handleSave = async () => {
    setOpenModal(false);
  };
  return (
    <Modal
      dismissible
      className="dark:text-white"
      size="6xl"
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
                  SVG, PNG, JPG or GIF
                </p>
              </div>
              <FileInput
                id="dropzone-file"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files[0])}
              />
            </Label>
          </div>
        </div>
        <HR.Trimmed />
        {data && (
          <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto p-4">
            {data.map((image) => {
              return (
                <div key={image.id} className="flex items-center space-x-4">
                  {/* Checkbox for each image */}
                  <Checkbox
                    id={image.id}
                    color="light"
                    onChange={(e) =>
                      handleCheckboxChange(image, e.target.checked)
                    }
                    checked={selectedImages.some(
                      (selectedImage) => selectedImage.id === image.id
                    )}
                  />

                  {/* Image display */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image}`}
                    alt={`image-${image.id}`}
                    className="max-h-16 max-w-20 rounded-lg object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-screen-primary dark:bg-black p-3">
        <Button color="dark" onClick={handleSave} size="xs" disabled={loading}>
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
