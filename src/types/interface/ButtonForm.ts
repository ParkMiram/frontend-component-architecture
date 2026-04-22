import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface ButtonForm
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  color?: string;
  children: React.ReactNode;
}

export interface PageButtonForm
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp;
  className?: string;
  children: React.ReactNode;
}
