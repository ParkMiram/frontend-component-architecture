import { useState } from "react";
import { Input, Kbd } from "@heroui/react";

import { SearchProps } from "../types/interface/PageInterface";

import { SearchIcon } from "@/assets/icons/SearchIcon.tsx";

const Search = ({
  handleFilterChange,
  label,
  onPageChange,
  children,
}: SearchProps) => {
  // state
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="search-container">
      <div className="search-box-wrap">
        <Input
          endContent={<Kbd keys={["enter"]} />}
          labelPlacement="outside"
          placeholder={label}
          startContent={<SearchIcon />}
          value={searchInput}
          variant="flat"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            const isComposing = (e.nativeEvent as any).isComposing;

            if (e.key === "Enter" && !isComposing) {
              e.preventDefault();
              handleFilterChange(searchInput);
              onPageChange(1);
            }
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default Search;
