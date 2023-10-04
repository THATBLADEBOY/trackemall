"use client";

import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Card as TremorCard, Title, AreaChart } from "@tremor/react";
import {
  CardContent,
  CardHeader,
  CardTitle,
  Card as UiCard,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { TableCaption, TableHeader } from "@/components/ui/table";

const chartdata = [
  {
    date: "09/15/23",
    Ebay: 2890,
  },
  {
    date: "Sept 22",
    Ebay: 2756,
  },
  {
    date: "Mar 22",
    Ebay: 3322,
  },
  {
    date: "Apr 22",
    Ebay: 3470,
  },
  {
    date: "May 22",
    Ebay: 3475,
  },
  {
    date: "Jun 22",
    Ebay: 3129,
  },
];

const sales = [
  {
    date: "09/15/23",
    amount: 20,
  },
  {
    date: "09/16/23",
    amount: 20,
  },
  {
    date: "09/17/23",
    amount: 25,
  },
  {
    date: "09/18/23",
    amount: 21,
  },
  {
    date: "09/19/23",
    amount: 20,
  },
  {
    date: "09/20/23",
    amount: 24,
  },
  {
    date: "09/21/23",
    amount: 20,
  },
  {
    date: "09/22/23",
    amount: 22,
  },
];

export default async function Card({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("card")
    .select(
      "*, card_set ( name, release_date ), card_sale (id, sold_at, price_in_us_cents)"
    )
    .eq("id", params.id);

  return (
    <div className="container pt-12 relative">
      <Breadcrumb className="absolute top-3 left-8">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">
            {data?.[0].card_set.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/components/breadcrumb">
            {data?.[0].name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {error && <div className="text-red-500">{error.message}</div>}
      {data && (
        <div className="flex">
          <img
            src={data[0].image_url}
            alt=""
            className="h-[35rem] mr-12 rounded-3xl"
          />
          <div className="w-full space-y-8">
            <UiCard>
              <CardHeader>
                <CardTitle>{data[0].name}</CardTitle>
                <CardContent></CardContent>
              </CardHeader>
            </UiCard>
            <TremorCard>
              <Title>Newsletter revenue over time (USD)</Title>
              <AreaChart
                className="h-72 mt-4"
                data={data[0].card_sale}
                index="sold_at"
                categories={["price_in_us_cents"]}
                colors={["indigo"]}
                valueFormatter={(number: number) => {
                  return (
                    "$ " +
                    Intl.NumberFormat("us")
                      .format(number / 100)
                      .toString()
                  );
                }}
              />
            </TremorCard>
            {data[0].card_sale && (
              <UiCard>
                <CardContent>
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data[0].card_sale.map((sale, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">Ebay</TableCell>
                          <TableCell>ungraded</TableCell>
                          <TableCell>{sale.sold_at}</TableCell>
                          <TableCell className="text-right">
                            {sale.price_in_us_cents}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </UiCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
