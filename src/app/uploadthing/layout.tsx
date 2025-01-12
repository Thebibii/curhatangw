import { AppSidebar } from "@/components/ui/sections/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

export default function UploadThingLayout(props: PropsWithChildren<{}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {props.children}
    </SidebarProvider>
  );
}
