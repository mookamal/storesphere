"use client";

import { Button, Modal, Label, TextInput, Spinner, Dropdown } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import Select from 'react-select'

countries.registerLocale(enLocale);


export default function BillingAddress({ openModal, setOpenModal, data, refreshData }) {
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(data.company || "")
  const [address1, setAddress1] = useState(data.address1 || "")
  const [address2, setAddress2] = useState(data.address2 || "")
  const [city, setCity] = useState(data.city || "")
  const [postalCode, setPostalCode] = useState(data.postalCode || "")
  const [country, setCountry] = useState(data.country || {})
  const countryObj = countries.getNames('en', { select: 'official' });
  const countryList = Object.entries(countryObj);
  const domain = useParams().domain;
  const optionCountries = [];

  for (let i = 0; i < countryList.length; i++) {
    optionCountries.push({ value: countryList[i][0], label: countryList[i][1] });
  }

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
            <Select
            options={optionCountries}
            onChange={(e) => setCountry({name: e.label , code: e.value})}
            value={{value:country.code,label:country.name}}
            menuPosition="fixed"
            id="country"
            classNames={{
              menuOption: () => "dark:text-white",
              placeholder: () => "dark:text-white",
              dropdownIndicator: () => "dark:text-white",
              clearIndicator: () => "dark:text-white",
              option: ({ isFocused, isSelected }) =>
                `${isFocused ? 'dark:bg-blue-100' : ''} ${isSelected ? 'dark:bg-blue-500 dark:text-white' : ''} dark:text-gray-800`,              
            }}
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
