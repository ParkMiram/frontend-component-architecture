import React from "react";
import { Outlet } from "react-router-dom";

import SideMenu from "./SideMenu";
import Main from "./Main";
import "../styles/main.scss";

const Layout: React.FC = () => {
  return (
    <div className="container">
      <SideMenu />
      <div className="content">
        <Main>
          <Outlet />
        </Main>
      </div>
    </div>
  );
};

export default Layout;
