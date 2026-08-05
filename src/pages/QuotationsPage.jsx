import { Suspense } from "react";
import { ClientWorkspaceShell } from "@/components/organisms/client-workspace-shell";
import { QuotationsClientView } from "@/components/organisms/quotations-client-view";
import { QuotationsHeaderActions } from "@/components/organisms/quotations-header-actions";
import "@/assets/styles/pages/QuotationsPage.scss";

export function QuotationsPage() {
    return (<Suspense fallback={<div className="quotations-page__loading">Loading...</div>}>
      <ClientWorkspaceShell moduleTitle="Quotations" moduleDescription="Premium quotation builder scoped to each client" basePath="/quotations" statLabels={{ items: "quotations", itemLabel: "quotes" }}>
        {({ clientId }) => (<>
            <div className="quotations-page__actions">
              <QuotationsHeaderActions clientId={clientId}/>
            </div>
            <QuotationsClientView clientId={clientId}/>
          </>)}
      </ClientWorkspaceShell>
    </Suspense>);
}
