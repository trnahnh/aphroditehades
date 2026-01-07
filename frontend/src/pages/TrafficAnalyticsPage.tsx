import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

const TrafficAnalyticsPage = () => {
  const { token } = useAuthStore();

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <h1 className="text-2xl font-bold">Traffic Analytics</h1>
          <p className="text-muted-foreground">
            View and analyze your traffic data here.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TrafficAnalyticsPage;
