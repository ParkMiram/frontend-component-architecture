import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type MenuItem = {
  name: string;
  path: string;
  icon: IconDefinition;
  alt: string;
  subMenu?: { name: string; path: string; icon: IconDefinition; alt: string }[];
};

export type SelectType = {
  value: string;
  label: string;
};
