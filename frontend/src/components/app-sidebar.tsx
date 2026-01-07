import * as React from "react";
import {
  IconChartBar,
  IconFingerprint,
  IconHelp,
  IconSettings,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "",
  },
  services: [
    {
      title: "Generative Identity",
      url: "/generative-identity",
      icon: IconFingerprint,
    },
    {
      title: "Traffic Analytics",
      url: "/traffic-analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className="flex items-center gap-3 h-10"
              onClick={() => toggleSidebar()}
            >
              <Logo />
              {state === "expanded" && <span>KatanaID</span>}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.services.map((service) => (
                <SidebarMenuItem key={service.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === service.url}
                  >
                    <Link to={service.url}>
                      <service.icon />
                      <span>{service.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
