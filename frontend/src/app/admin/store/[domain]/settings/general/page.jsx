"use client";

import { MdEditNote } from "react-icons/md";
import { useEffect, useState } from "react";
import ProfileStoreModal from "@/components/admin/settings/general/ProfileStoreModal";
import axios from "axios";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import animation from "@/assets/animation/loading.json";
import Lottie from "lottie-react";
import Error from "@/components/admin/Error";
import BillingAddressModal from "@/components/admin/settings/general/BillingAddressModal";
import StoreCurrencyModel from "@/components/admin/settings/general/StoreCurrencyModel";
let cc = require("currency-codes");

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function General({ params }) {
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [openProfileStoreModal, setOpenProfileStoreModal] = useState(false);
  const [openBillingAddressModel, setOpenBillingAddressModel] = useState(false);
  const [openStoreCurrencyModel, setOpenStoreCurrencyModel] = useState(null);
  const domain = params.domain;

  const getData = async () => {
    try {
      const response = await axios.post("/api/get-data", {
        query: GET_SETTINGS_GENERAL,
        variables: { domain: domain },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setData(response.data.store);
    } catch (error) {
      console.error("Error fetching store details:", error.message);
      setData(null);
      setError(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <Error />;
  }

  if (!data) {
    return <Lottie animationData={animation} loop={true} />;
  }

  return (
    <div className="grid md:grid-cols-2  gap-3 my-10">
      {/* Store details */}
      <Card>
        <CardHeader>
          <CardTitle>Store details</CardTitle>
          <hr className="border" />
          <Button
            variant="secondary"
            onClick={() => setOpenProfileStoreModal(true)}
          >
            <MdEditNote size={20} />
          </Button>
          <ProfileStoreModal
            openModal={openProfileStoreModal}
            setOpenModal={setOpenProfileStoreModal}
            data={data}
            refreshData={getData}
          />
        </CardHeader>
        <CardContent>
          <h2 className="text-sm text-muted-foreground text-center">
            {data.name}
          </h2>
        </CardContent>
      </Card>
      {/* Billing address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing address</CardTitle>
          <hr className="border" />

          <Button
            variant="secondary"
            onClick={() => setOpenBillingAddressModel(true)}
          >
            <MdEditNote size={20} />
          </Button>
          <BillingAddressModal
            openModal={openBillingAddressModel}
            setOpenModal={setOpenBillingAddressModel}
            data={data.billingAddress}
            refreshData={getData}
          />
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            <h2>Billing address</h2>
            <h2>{data.billingAddress.phone}</h2>
          </div>
        </CardContent>
      </Card>
      {/* store defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Store defaults</CardTitle>
          <hr className="border" />
          <Button
            variant="secondary"
            onClick={() => setOpenStoreCurrencyModel(true)}
          >
            <MdEditNote size={20} className="text-gray-500 dark:text-gray-50" />
          </Button>

          <StoreCurrencyModel
            openModal={openStoreCurrencyModel}
            setOpenModal={setOpenStoreCurrencyModel}
            currencyCode={data.currencyCode}
            refreshData={getData}
          />
        </CardHeader>
        <CardContent>
          {data.currencyCode && (
            <div className="flex justify-center">
              <Badge>{cc.code(data.currencyCode).currency}</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
