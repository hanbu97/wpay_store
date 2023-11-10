"use client";

import { Row, } from "@tanstack/react-table";
import PostStatusButton from "../buttons/post-status-button";

// interface DataTableRowStatusProps<TData> {
//   row: Row<TData>;
// }

interface RowData {
  published: boolean;
  // 其他属性...
}

interface DataTableRowStatusProps {
  row: Row<RowData>;
}

export function DataTableRowStatus({
  row,
}: DataTableRowStatusProps) {
  return <PostStatusButton row={row} />;
}