"use client";

import React, { ReactNode } from "react";
import { SitioConfigProvider } from "@/components/site/SitioConfigProvider";
import type { ConfigSitio } from "@/lib/configSitio";
import { ToastProvider } from "@/components/ui/Toast";
import { MiFiestaProvider } from "@/context/MiFiestaContext";
import MiFiestaBar from "@/components/mifiesta/MiFiestaBar";
import MiFiestaSheet from "@/components/mifiesta/MiFiestaSheet";

export default function PublicProviders({ config, children }: { config: ConfigSitio; children: ReactNode }) {
  return (
    <SitioConfigProvider config={config}>
      <ToastProvider>
        <MiFiestaProvider>
          {children}
          <MiFiestaBar />
          <MiFiestaSheet />
        </MiFiestaProvider>
      </ToastProvider>
    </SitioConfigProvider>
  );
}
