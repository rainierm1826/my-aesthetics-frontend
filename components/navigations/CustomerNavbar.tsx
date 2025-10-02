"use client";

import DropDownMenuCustomerProfile from "../dropdowns/DropDownMenuCustomerProfile";
import Logo from "../Logo";

const CustomerNavbar = () => {
  return (
    <header className="flex h-(--header-height) container shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 p-3 lg:gap-2 lg:px-6">
        <Logo mainSize="text-4xl" size="text-xl" href="/" />
        <div className="ml-auto flex items-center gap-2">
          <DropDownMenuCustomerProfile />
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;
