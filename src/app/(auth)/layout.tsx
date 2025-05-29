import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex items-center justify-center flex-col min-h-svh p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl ">
        {children}
        </div>
    </div>
  );
};

export default Layout;
