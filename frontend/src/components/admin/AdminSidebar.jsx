"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { IoHome, IoSettings } from "react-icons/io5";
import { FaAward } from "react-icons/fa6";
import Link from "next/link";
export default function AdminSidebar() {
  const pathname = usePathname();
  const storeDomain = pathname.split("/")[2];
  const currentPath = pathname.split("/")[3] || "";

  const adminLinksList = [
    { title: "Home", url: `/store/${storeDomain}`, icon: IoHome },
    {
      title: "Products",
      url: `/store/${storeDomain}/products`,
      icon: FaAward,
    },
    {
      title: "Settings",
      url: `/store/${storeDomain}/settings/general`,
      icon: IoSettings,
    },
  ];
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinksList.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild>
                    <Link href={link.url}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
