import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Breadcrumbs, Layout } from "../../components/Themed";
import { Text } from "../../components/Themed";
import Invoice from "./invoice";

export default () => {
  const { params } = useRoute<any>();

  return (
    <Layout>
      <Breadcrumbs
        links={[
          {
            name: "Dashboard",
          },
          {
            name: "Invoices",
          },
        ]}
      />
      {params ? (
        <Invoice invoiceID={params["invoiceID"]} />
      ) : (
        <>
          <Text>NO PARAMS</Text>
        </>
      )}
    </Layout>
  );
};
