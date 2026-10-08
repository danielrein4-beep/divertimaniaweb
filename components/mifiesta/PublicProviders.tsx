"use client";

import React, { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { MiFiestaProvider } from "@/context/MiFiestaContext";
import MiFiestaBar from "@/components/mifiesta/MiFiestaBar";
import MiFiestaSheet from "@/components/mifiesta/MiFiestaSheet";

export default function PublicProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <MiFiestaProvider>
        {children}
        <MiFiestaBar />
        <MiFiestaSheet />
      </MiFiestaProvider>
    </ToastProvider>
  );
}
