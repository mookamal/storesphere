"use client";

import { Button, Modal, Label, TextInput, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import Select from 'react-select'
import axios from 'axios';
import { toast } from 'react-toastify';
import { UPDATE_STORE_ADDRESS } from "@/graphql/mutations";
countries.registerLocale(enLocale);

export default function BillingAddressModal({ openModal, setOpenModal, data, refreshData }) {
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(data.company || "")
  const [address1, setAddress1] = useState(data.address1 || "")
  const [address2, setAddress2] = useState(data.address2 || "")
  const [city, setCity] = useState(data.city || "")
  const [zip, setZip] = useState(data.zip || "")
  const [country, setCountry] = useState({name: data.country.name , code: data.country.code} || {})
  const countryObj = countries.getNames('en', { select: 'official' });
  const countryList = Object.entries(countryObj);
  const domain = useParams().domain;
  const optionCountries = [];

  for (let i = 0; i < countryList.length; i++) {
    optionCountries.push({ value: countryList[i][0], label: countryList[i][1] });
  }
  
  useEffect(() => {
    if (
      company !== data.company ||
      country.code!== data.country.code ||
      address1!== data.address1 ||
      address2!== data.address2 ||
      city!== data.city ||
      zip!== data.zip
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  } , [company,country , address1, address2, city, zip , data]);

  const handleSave = async () => {
    setLoading(true);
    const variables = {
      input: {
        company: company,
        country: country,
        address1: address1,
        address2: address2,
        city: city,
        zip: zip,
      },
      defaultDomain: domain
    };

    try {
      const response = await axios.post('/api/set-data', {
        query: UPDATE_STORE_ADDRESS,
        variables: variables
      },);

      refreshData();
      setOpenModal(false);
      toast.success('Store profile updated successfully!');
    } catch (error) {
      if (error.response.data.error) {
        console.error(error.response.data.error);
      }
      console.error('Error updating store profile:', error.message);
      toast.error('Failed to update store profile!');
    }

    // save data to API
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
          {/* company */}
          <div>
            <div className="mb-2">
              <Label htmlFor="company" value="Legal business name" />
            </div>
            <TextInput id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          {/* Country */}
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
              option: ({ isFocused, isSelected }) =>
                `${isFocused ? 'dark:bg-blue-100' : ''} ${isSelected ? 'dark:bg-blue-500 dark:text-white' : ''} dark:text-gray-800`,              
            }}
            />
          </div>
          {/* city */}
          <div>
            <div className="mb-2">
              <Label htmlFor="city" value="City" />
            </div>
            <TextInput id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          {/* address1 */}
          <div>
            <div className="mb-2">
              <Label htmlFor="address1" value="Address" />
            </div>
            <TextInput id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
          </div>
          {/* address2 */}

          <div>
            <div className="mb-2">
              <Label htmlFor="address2" value="Apartment, suite, etc" />
            </div>
            <TextInput id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
          </div>
          {/* postalCode */}
          <div>
            <div className="mb-2">
              <Label htmlFor="zip" value="Postal code" />
            </div>
            <TextInput id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
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
