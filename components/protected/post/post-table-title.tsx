import PostCreateButton from "@/components/protected/post/buttons/post-create-button";
import { protectedPostConfig } from "@/config/protected";

const PostTableTitle = () => {
  return (
    <>
      <div className="mb-5 flex flex-row border-b border-gray-200 pb-5">
        <div className="flex-none items-center justify-start">
          <h1 className="text-xl font-semibold leading-6 text-white">
            {protectedPostConfig.title}
          </h1>
          <p className="mt-2 text-sm text-gray-100">
            {protectedPostConfig.description}
          </p>
        </div>
        <div className="flex-grow"></div>
        <div className="flex-none items-center justify-end">
          <PostCreateButton />
        </div>
      </div>
    </>
  );
};

export default PostTableTitle;
