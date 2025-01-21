"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  IoHome, 
  IoSettings, 
  IoCart,      
} from "react-icons/io5";
import { 
  FaAward, 
  FaUserCheck, 
  FaChartLine    
} from "react-icons/fa6";

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

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const storeDomain = useMemo(() => pathname.split("/")[2], [pathname]);

  const adminLinksList = useMemo(() => [
    { 
      title: "Home", 
      url: `/store/${storeDomain}`, 
      icon: IoHome 
    },
    {
      title: "Analytics",
      url: `/store/${storeDomain}/analytics`,
      icon: FaChartLine,
    },
    {
      title: "Products",
      url: `/store/${storeDomain}/products`,
      icon: FaAward,
      subLinks: [
        {
          title: "Collections",
          url: `/store/${storeDomain}/collections`,
        },
        {
          title: "Inventory",
          url: `/store/${storeDomain}/products/inventory`,
        }
      ],
    },
    {
      title: "Sales",
      url: `/store/${storeDomain}/sales`,
      icon: IoCart,
      subLinks: [
        {
          title: "Orders",
          url: `/store/${storeDomain}/sales/orders`,
        },
        {
          title: "Refunds",
          url: `/store/${storeDomain}/sales/refunds`,
        }
      ]
    },
    {
      title: "Customers",
      url: `/store/${storeDomain}/customers`,
      icon: FaUserCheck,
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
        {
          title: "Integrations",
          url: `/store/${storeDomain}/settings/integrations`,
        }
      ],
    },
  ], [storeDomain]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinksList.map((link) => (
                <SidebarMenuItem 
                  key={link.title} 
                  active={pathname.includes(link.url) ? "true" : "false"}
                >
                  <SidebarMenuButton asChild>
                    <Link href={link.url}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {link.subLinks && (
                    <SidebarMenuSub>
                      {link.subLinks.map((subLink) => (
                        <SidebarMenuSubItem 
                          key={subLink.title}
                          active={pathname === subLink.url ? "true" : "false"}
                        >
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