"use client";

import { Draft } from "@/types/collection";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { categories, statuses } from "./data/data";
import { useState } from "react";
import { DataTable } from "@/components/protected/post/table/data-table";
import { DataTableRowStatus } from "./data-table-row-status";


const ProductTable = ({ data }) => {
  // Ensure that columns is defined inside the component or imported if defined elsewhere
  const [showModal, setShowModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const Modal = ({ isOpen, content, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <p>{content}</p>
          <button onClick={() => onClose(false)}>Cancel</button>
          <button onClick={() => onClose(true)}>Confirm</button>
        </div>
      </div>
    );
  };

  const columns: ColumnDef<Draft>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "price", // 这是列对应数据的键名
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => <span>{row.getValue("price")}</span>, // 如何渲染单元格内容
    },
    {
      accessorKey: "category_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const label = categories.find(
          (category) => category.value === row.original.category_id,
        );
  
        if (!label) {
          return null;
        }
  
        return (
          <div className="flex space-x-2 text-white">
            <div className="max-w-[500px] justify-start truncate font-medium text-white">
              <span className="inline-flex items-center rounded-full border border-gray-400 px-3 py-1 text-sm text-white">
                <label.icon className="mr-1 h-4 w-4 text-white fill-current" />
                {label.label}
              </span>
            </div>
          </div>
        );
      },
      enableHiding: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      // cell: ({ row }) => {
      //   const isPublished = row.original.published;
      //   const statusLabel = isPublished ? "Published" : "Draft";
        
  
      //   const handleStatusClick = () => {
      //     console.log("Button clicked for ID:", row.original.id);
      //     // 您可以在这里添加更多的逻辑，例如调用函数、打开模态框等
      //     const action = isPublished ? "unpublish" : "publish";
      //     const content = `Are you sure you want to ${action} this item?`;
  
      //     setModalContent(content);
      //     setIsModalOpen(true);
      //     // setShowModal(true)
      //   };
  
      //   return (
      //     <div className="flex w-[100px] items-center justify-between text-white">
      //     <button 
      //       onClick={handleStatusClick} 
      //       className="border border-white hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      //     >
      //       {statusLabel}
      //     </button>
      //   </div>
      //   );
      // },
      cell: ({ row }) => <DataTableRowStatus row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = format(new Date(row.getValue("created_at")), "MM/dd/yyyy");
  
        if (!date) {
          return null;
        }
  
        return (
          <div className="flex w-[100px] items-center">
            <span>{date}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => <DataTableRowActions row={row} />,
      enableHiding: false,
      enableSorting: false,
    },
  ];

   return (
    <div>
    <DataTable data={data || []} columns={columns} />
    <Modal isOpen={isModalOpen} content={modalContent} onClose={setIsModalOpen} />
  </div>
  );
};

export default ProductTable;


