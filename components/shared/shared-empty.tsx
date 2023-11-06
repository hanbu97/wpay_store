import { sharedEmptyConfig } from "@/config/shared";
import { AlertTriangleIcon } from "lucide-react";

const SharedEmpty = () => {
  return (
    <div className="mx-auto my-5 max-w-3xl rounded-lg border-2 border-dashed border-white bg-black p-12 text-center">
      <AlertTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="text-md mt-2 font-semibold text-gray-100">
        {sharedEmptyConfig.title}
      </h3>
      <p className="text-md mt-1 text-gray-300">
        {sharedEmptyConfig.description}
      </p>
    </div>
  );
};

export default SharedEmpty;
