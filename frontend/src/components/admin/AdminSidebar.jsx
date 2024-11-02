"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
      subLinks: [
        {
          title: "General",
          url: `/store/${storeDomain}/settings/general`,
        },
        {
          title: "Plan",
          url: `/store/${storeDomain}/settings/plan`,
        },
      ],
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
                  {link.subLinks && (
                    <SidebarMenuSub>
                      {link.subLinks.map((subLink) => (
                        <SidebarMenuSubItem key={subLink.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subLink.url}>
                              <span>{subLink.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
