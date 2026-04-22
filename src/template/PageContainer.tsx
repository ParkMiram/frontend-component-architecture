import React from "react";

import "../styles/page.scss";
import { ChildrenInterface } from "../types/interface/ChildrenInterface";

export const PageContainer: React.FC<ChildrenInterface> = ({ children }) => {
  return <div className="page-container">{children}</div>;
};
