import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import React from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider maxVisibleToasts={5} />
      {children}
    </HeroUIProvider>
  );
}
