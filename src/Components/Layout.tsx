import React from "react";

const Layout: React.FC = ({ children }: any) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">{children}</div>
  );
};

export default Layout;
