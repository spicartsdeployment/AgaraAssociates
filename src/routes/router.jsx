import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/templates/dashboard-layout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { DesignLibraryPage } from "@/pages/DesignLibraryPage";
import { DesignFolderPage } from "@/pages/DesignFolderPage";
import { NewProjectPage } from "@/pages/NewProjectPage";
import { ClientsPage } from "@/pages/ClientsPage";
import { ClientDetailPage } from "@/pages/ClientDetailPage";
import { DesignStudioPage } from "@/pages/DesignStudioPage";
import { BoqListPage } from "@/pages/BoqListPage";
import { BoqNewPage } from "@/pages/BoqNewPage";
import { BoqDetailPage } from "@/pages/BoqDetailPage";
import { QuotationsPage } from "@/pages/QuotationsPage";
import { QuotationDetailPage } from "@/pages/QuotationDetailPage";
import { MaterialsPage } from "@/pages/MaterialsPage";
import { VendorsPage } from "@/pages/VendorsPage";
import { ProcurementPage } from "@/pages/ProcurementPage";
import { SiteProgressPage } from "@/pages/SiteProgressPage";
import { DocumentsPage } from "@/pages/DocumentsPage";
import { ApprovalsPage } from "@/pages/ApprovalsPage";
import { TeamPage } from "@/pages/TeamPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { FinancePage } from "@/pages/FinancePage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AiAssistantPage } from "@/pages/AiAssistantPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import "@/assets/styles/pages/RouterFallback.scss";

const MarketingProjectsPage = lazy(
  () => import("@/pages/marketing/MarketingProjectsPage")
);
const MarketingProjectDetailPage = lazy(
  () => import("@/pages/marketing/MarketingProjectDetailPage")
);
const MarketingServicesPage = lazy(
  () => import("@/pages/marketing/MarketingServicesPage")
);
const MarketingAboutPage = lazy(
  () => import("@/pages/marketing/MarketingAboutPage")
);
const MarketingJournalPage = lazy(
  () => import("@/pages/marketing/MarketingJournalPage")
);
const MarketingJournalDetailPage = lazy(
  () => import("@/pages/marketing/MarketingJournalDetailPage")
);
const MarketingContactPage = lazy(
  () => import("@/pages/marketing/MarketingContactPage")
);

function withMarketingSuspense(element) {
  return (
    <Suspense
      fallback={<div className="router-fallback" />}
    >
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/projects",
        element: withMarketingSuspense(<MarketingProjectsPage />),
      },
      {
        path: "/projects/:id",
        element: withMarketingSuspense(<MarketingProjectDetailPage />),
      },
      {
        path: "/services",
        element: withMarketingSuspense(<MarketingServicesPage />),
      },
      {
        path: "/about",
        element: withMarketingSuspense(<MarketingAboutPage />),
      },
      {
        path: "/journal",
        element: withMarketingSuspense(<MarketingJournalPage />),
      },
      {
        path: "/journal/:slug",
        element: withMarketingSuspense(<MarketingJournalDetailPage />),
      },
      {
        path: "/contact",
        element: withMarketingSuspense(<MarketingContactPage />),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/app/projects", element: <ProjectsPage /> },
      { path: "/app/projects/new", element: <NewProjectPage /> },
      { path: "/app/projects/:id", element: <ProjectDetailPage /> },
      { path: "/app/projects/:projectId/designs", element: <DesignLibraryPage /> },
      { path: "/app/projects/:projectId/designs/:folderId", element: <DesignFolderPage /> },
      { path: "/clients", element: <ClientsPage /> },
      { path: "/clients/:id", element: <ClientDetailPage /> },
      { path: "/design-studio", element: <DesignStudioPage /> },
      { path: "/boq", element: <BoqListPage /> },
      { path: "/boq/new", element: <BoqNewPage /> },
      { path: "/boq/:id", element: <BoqDetailPage /> },
      { path: "/quotations", element: <QuotationsPage /> },
      { path: "/quotations/:id", element: <QuotationDetailPage /> },
      { path: "/materials", element: <MaterialsPage /> },
      { path: "/vendors", element: <VendorsPage /> },
      { path: "/procurement", element: <ProcurementPage /> },
      { path: "/site-progress", element: <SiteProgressPage /> },
      { path: "/documents", element: <DocumentsPage /> },
      { path: "/approvals", element: <ApprovalsPage /> },
      { path: "/team", element: <TeamPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/finance", element: <FinancePage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/ai-assistant", element: <AiAssistantPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
