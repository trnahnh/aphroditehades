import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

const GenerativeIdentityPage = () => {
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
          <h1 className="text-2xl font-bold">Generative Identity</h1>
          <p className="text-muted-foreground">
            Manage your generative identity services here.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default GenerativeIdentityPage;
