import { protectedEditorConfig } from "@/config/protected";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React from "react";

const EditorUploadCoverImagePlaceHolder = () => {
  return (
    <div className="col-span-full max-w-2xl">
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-100 px-6 py-10">
        <div className="text-center">
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-200">
            <p className="pl-1">{protectedEditorConfig.formImageNote}</p>
          </div>
          <p className="text-sm leading-5 text-gray-200">
            {protectedEditorConfig.formImageSize}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorUploadCoverImagePlaceHolder;
