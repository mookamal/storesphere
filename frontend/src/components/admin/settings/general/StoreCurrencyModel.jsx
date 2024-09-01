"use client";

import { Button, Modal, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Select from 'react-select'
let data = require('currency-codes/data');
let cc = require('currency-codes');
export default function StoreCurrencyModel({ openModal, setOpenModal, currencyCode, refreshData }) {
    const domain = useParams().domain;
    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [code, setCode] = useState(currencyCode || '');
    const optionCurrency = [];

    data.forEach((currency) => {
        optionCurrency.push({ value: currency.code, label: currency.currency });
    });

    useEffect(() => {
        if (code !== currencyCode) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [code]);

    const handleSave = async () => {
        setLoading(true);
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
                <span className="font-semibold text-base">Change store currency</span>
            </Modal.Header>

            <Modal.Body className="dark:bg-slate-900">
            <Select
            options={optionCurrency}
            menuPosition="fixed"
            value={{value: code , label: cc.code(code).currency}}
            onChange={(e) => {
                setCode(e.value);
            }}
            id="country"
            classNames={{
              option: ({ isFocused, isSelected }) =>
                `${isFocused ? 'dark:bg-blue-100' : ''} ${isSelected ? 'dark:bg-blue-500 dark:text-white' : ''} dark:text-gray-800`,              
            }}
            />
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
