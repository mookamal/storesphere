"use client";
import ProfileStoreModal from "@/components/admin/settings/general/ProfileStoreModal";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import Error from "@/components/admin/Error";
import BillingAddressModal from "@/components/admin/settings/general/BillingAddressModal";
import StoreCurrencyModel from "@/components/admin/settings/general/StoreCurrencyModel";
import { useQuery } from '@apollo/client';
import { cardVariants } from "@/utils/cardVariants";
let cc = require("currency-codes");

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import LoadingElement from "@/components/LoadingElement";

export default function General() {
  const domain = useParams().domain;
  const { data, loading, error, refetch } = useQuery(GET_SETTINGS_GENERAL, {
    variables: { domain: domain },
  });
  if (loading) return <LoadingElement />;

  if (error) {
    return <Error />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-10">
      {/* Store details */}
      <Card className={cardVariants.base}>
        <CardHeader className={cardVariants.header}>
          <CardTitle className={cardVariants.title}>
            Store details
          </CardTitle>
          <hr className="border" />

          <ProfileStoreModal data={data.store} refreshData={refetch} />
        </CardHeader>
        <CardContent className={cardVariants.content}>
          <h2 className="text-sm text-muted-foreground text-center">
            {data.store.name}
          </h2>
        </CardContent>
      </Card>
      {/* Billing address */}
      <Card className={cardVariants.base}>
        <CardHeader className={cardVariants.header}>
          <CardTitle className={cardVariants.title}>Billing address</CardTitle>
          <hr className="border" />

          <BillingAddressModal data={data.store.billingAddress} refreshData={refetch} />
        </CardHeader>
        <CardContent className={cardVariants.content}>
          <h2 className="text-sm text-muted-foreground text-center">
            {data.store?.billingAddress?.phone || ""}
          </h2>
        </CardContent>
      </Card>
      {/* store defaults */}
      <Card className={cardVariants.base}>
        <CardHeader className={cardVariants.header}>
          <CardTitle className={cardVariants.title}>Store defaults</CardTitle>
          <hr className="border" />

          <StoreCurrencyModel
            currencyCode={data.store.currencyCode}
            refreshData={refetch}
          />
        </CardHeader>
        <CardContent className={cardVariants.content}>
          {data.store.currencyCode && (
            <div className="flex justify-center">
              <Badge>{cc.code(data.store.currencyCode).currency}</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
