import {
  ProtectedBookMarkTableColumns,
  ProtectedBookMarkTableTitle,
} from "@/components/protected/bookmark";
import { DataTable } from "@/components/protected/post/table/data-table";
import TableEmpty from "@/components/protected/table/table-empty";
import { detailBookMarkConfig } from "@/config/detail";
import { sharedEmptyConfig } from "@/config/shared";
import { BookMarkWithPost, Post, Profile } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: detailBookMarkConfig.title,
  description: detailBookMarkConfig.description,
};

interface BookmarksPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface OrdersRes {
  data: Data;
}

export interface Data {
  transactions: Transaction[];
}

export interface Transaction {
  abiParameters: null;
  amounts: string[];
  blockchain: string;
  blockHash: string;
  blockHeight: number;
  createDate: string;
  custodyType: string;
  destinationAddress: string;
  firstConfirmDate: string;
  id: string;
  networkFee: string;
  nfts: null;
  operation: string;
  sourceAddress: string;
  state: string;
  tokenId: string;
  transactionType: string;
  txHash: string;
  updateDate: string;
  walletId: string;
}


const fetchOrders = async (destinationAddress: string | null | undefined): Promise<Transaction[]> => {
  // fetch orders
  // const sessions
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

  let orders: OrdersRes;
  const data = await fetch(url, options)
    .then(res => res.json())
    .then(json => {
      // console.log(json)
      orders = json;
      const transactions = orders.data.transactions;
      // console.log(transactions);
      return transactions;
    })
    .catch(err => console.error('error:' + err));

  return [];
}

const BookmarksPage: React.FC<BookmarksPageProps> = async ({
  searchParams,
}) => {
  let posts: Post[] = [];
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


  // console.log(profileData?.address);
  // fetch transactions
  const transactions = await fetchOrders(profileData?.address);
  console.log(transactions);
  

  // Fetch total pages
  const { count } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact", head: true });

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pagination
  const limit = 10;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;
  const from = (page - 1) * limit;
  const to = page ? from + limit : limit;

  // Fetch posts
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`*, posts(*)`)
    .order("created_at", { ascending: false })
    .match({ user_id: user?.id })
    .range(from, to)
    .returns<BookMarkWithPost[]>();

  if (!data || error || !data.length) {
    notFound;
  }

  data?.map((bookmark) => {
    posts.push(bookmark.posts);
  });

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        {posts?.length && posts?.length > 0 ? (
          <>
            <ProtectedBookMarkTableTitle />
            <DataTable data={posts} columns={ProtectedBookMarkTableColumns} />
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
