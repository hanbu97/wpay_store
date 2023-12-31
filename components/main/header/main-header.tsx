import { MainDesktopNavigation, MainMobileNavigation } from "./navigations";

export default function MainHeader() {
  return (
    <div className="border-b border-white bg-black border-y-1 sticky top-0 z-50 border-black/5 shadow-sm shadow-gray-300 backdrop-blur-lg">
      <MainDesktopNavigation />
      <MainMobileNavigation />
    </div>
  );
}
