import { DeletePost } from "@/actions/post/delete-post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { protectedPostConfig } from "@/config/protected";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  MoreVertical as ElipsisIcon,
  Loader2 as SpinnerIcon,
  Trash as TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { Row } from "@tanstack/react-table";
import { UnPublishPost } from "@/actions/post/unpublish-post";
import { PublishPost } from "@/actions/post/publish-post";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PostStatusButtonProps<TData> {
  row: Row<TData>;
}

interface RowData {
  published: boolean;
  // ...
}

const PostStatusButton = <TData extends RowData,>({ row }: PostStatusButtonProps<TData>) => {
  const supabase = createClient();
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [showLoadingAlert, setShowLoadingAlert] = useState<boolean>(false);

  const id: string = row.getValue("id");

  // Check authentitication and bookmark states
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [id, session?.user.id, supabase.auth]);

  // update state
  async function PublishOrUnpublishPost() {
    setIsDeleteLoading(true);
    if (id && session?.user.id) {
      const myPostData = {
        id: id,
        user_id: session?.user.id,
      };

      let response;
      if (isPublished) {
          response = await UnPublishPost(myPostData);
      } else {
         response = await PublishPost(myPostData);
      }
      
      if (response) {
        setIsDeleteLoading(false);
        toast.success('Product status updated successfully!');
        router.refresh();
      } else {
        setIsDeleteLoading(false);
        toast.error('Couldn\'t update product status!');
      }
    } else {
      setIsDeleteLoading(false);
      toast.error('Couldn\'t update product status!');
    }
  }

  // const isPublished = row.original.published;
  const isPublished: Boolean = row.original.published;
  const statusLabel = isPublished ? "Published" : "Draft";

  const action = isPublished ? "unpublish" : "publish";
  const content = `Are you sure you want to ${action.toUpperCase()} this item?`;
  const warning = isPublished ? "Once unpublished this item will be removed from the public feed." : "Once published this item will be visible to the public.";

  return (
    <>
        <div className="flex w-[100px] items-center justify-between text-white">
         <button 
           onClick={() => setShowDeleteAlert(true)}
           className="border border-white hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
         >
           {statusLabel}
         </button>
       </div>
      {/* Delete alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="text-md font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {content}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {warning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{protectedPostConfig.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={PublishOrUnpublishPost}>
              {isDeleteLoading ? (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="mr-2 h-4 w-4" />
              )}
              <span>{protectedPostConfig.confirm}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostStatusButton;
