import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

const BlankColumn = ({ value }: { value: ReactNode }) => {
  if (value === null || value === undefined || value === "") {
    return <FontAwesomeIcon color="var(--gray-500)" icon={faMinus} size="sm" />;
  }

  if (typeof value === "boolean") {
    return String(value).toUpperCase();
  }

  return value;
};

export default BlankColumn;
