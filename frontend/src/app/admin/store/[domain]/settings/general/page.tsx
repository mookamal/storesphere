"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cardVariants } from "@/utils/cardVariants";
import LoadingElement from "@/components/LoadingElement";
import Error from "@/components/admin/Error";
import dynamic from "next/dynamic";
import cc from "currency-codes";
import { ReactNode } from "react";
import { useSettingsGeneralQuery } from "@/codegen/generated";

const ProfileStoreModal = dynamic(
  () => import("@/components/admin/settings/general/ProfileStoreModal")
);
const BillingAddressModal = dynamic(
  () => import("@/components/admin/settings/general/BillingAddressModal")
);
const StoreCurrencyModel = dynamic(
  () => import("@/components/admin/settings/general/StoreCurrencyModel")
);

interface CustomCardProps {
  title: string;
  actionComponent: ReactNode;
  children: ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  actionComponent,
  children,
}) => (
  <Card className={cardVariants.base}>
    <CardHeader
      className={`${cardVariants.header} flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <CardTitle className={cardVariants.title}>{title}</CardTitle>
        {actionComponent}
      </div>
      <hr className="border" />
    </CardHeader>
    <CardContent className={cardVariants.content}>{children}</CardContent>
  </Card>
);

export default function General(): JSX.Element {
  // Get domain from URL params
  const { domain } = useParams() as { domain: string };
  const { data, loading, error, refetch } = useSettingsGeneralQuery({
    variables: { domain },
  });

  if (loading) return <LoadingElement />;
  if (error) return <Error />;

  const store = data?.store;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-8 mx-4">
      <CustomCard
        title="Store details"
        actionComponent={
          <ProfileStoreModal data={store} refreshData={refetch} />
        }
      >
        <h2
          className="text-sm text-muted-foreground text-center truncate"
          title={store?.name}
        >
          {store?.name}
        </h2>
      </CustomCard>

      <CustomCard
        title="Billing address"
        actionComponent={
          <BillingAddressModal
            data={store?.billingAddress}
            refreshData={refetch}
          />
        }
      >
        <p className="text-sm text-muted-foreground text-center truncate">
          {store?.billingAddress?.company || (
            <span className="text-gray-400">No company name</span>
          )}
        </p>
      </CustomCard>

      <CustomCard
        title="Store defaults"
        actionComponent={
          <StoreCurrencyModel
            currencyCode={store?.currencyCode}
            refreshData={refetch}
          />
        }
      >
        <div className="flex justify-center">
          {store?.currencyCode ? (
            <Badge aria-label="Store currency">
              {cc.code(store?.currencyCode)?.currency || store.currencyCode}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">Not set</span>
          )}
        </div>
      </CustomCard>
    </div>
  );
}
