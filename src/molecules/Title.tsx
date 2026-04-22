import React from "react";

import "../styles/page.scss";
import { ChildrenInterface } from "../types/interface/ChildrenInterface";

export const PageTitle: React.FC<ChildrenInterface> = ({ children }) => {
  return <p className="page-title">{children}</p>;
};

export const ModalTitle: React.FC<ChildrenInterface> = ({ children }) => {
  return <p className="modal-title">{children}</p>;
};
