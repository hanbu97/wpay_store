import {
  ProtectedBookMarkTableColumns,
  ProtectedBookMarkTableTitle,
} from "@/components/protected/bookmark";
import { DataTable } from "@/components/protected/post/table/data-table";
import { OrderTable } from "@/components/protected/post/table/order-table";
import TableEmpty from "@/components/protected/table/table-empty";
import { detailBookMarkConfig } from "@/config/detail";
import { sharedEmptyConfig } from "@/config/shared";
import {  Profile } from "@/types/collection";
import { OrdersRes, Transaction } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: detailBookMarkConfig.title,
  description: detailBookMarkConfig.description,
};

interface BookmarksPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}



const fetchOrders = async (destinationAddress: string | null | undefined): Promise<Transaction[]> => {
  // fetch orders
  // const sessions
  console.log(destinationAddress);
  if (destinationAddress == null || destinationAddress == undefined) {
    return [];
  }

  const url = `https://api.circle.com/v1/w3s/transactions?destinationAddress=${destinationAddress}&pageSize=20`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'
    }
  };

  // let orders: OrdersRes;
  // const data = await fetch(url, options)
  //   .then(res => res.json())
  //   .then(json => {
  //     orders = json;
  //     const transactions = orders.data.transactions;
  //     // console.log(transactions);
  //     return transactions;
  //   })
  //   .catch(err => console.error('error:' + err));

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders: OrdersRes = await response.json();
    const transactions = orders.data.transactions;
    console.log(transactions);
    return transactions;
  } catch (err) {
    console.error('error:', err);
    return []; // 出现错误时返回空数组
  }

  return [];
}

const BookmarksPage: React.FC<BookmarksPageProps> = async ({
  searchParams,
}) => {
  // let transactions: Transaction[] = [];
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .match({ id: userId })
    .single<Profile>();

  const transactions = await fetchOrders(profileData?.address);
  console.log(transactions);

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        {transactions?.length && transactions?.length > 0 ? (
          <>
            <ProtectedBookMarkTableTitle />
            <OrderTable data={transactions} />
          </>
        ) : (
          <TableEmpty
            emptyTitle={sharedEmptyConfig.title}
            emptyDescription={sharedEmptyConfig.description}
          />
        )}
      </div>
    </>
  );
};

export default BookmarksPage;
