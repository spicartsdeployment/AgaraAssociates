import { Suspense } from "react";
import { ClientWorkspaceShell } from "@/components/organisms/client-workspace-shell";
import { BoqClientView } from "@/components/organisms/boq-client-view";
import { BoqHeaderActions } from "@/components/organisms/boq-header-actions";
import "@/assets/styles/pages/BoqListPage.scss";

export function BoqListPage() {
    return (<Suspense fallback={<div className="boq-list-page__loading">Loading...</div>}>
      <ClientWorkspaceShell moduleTitle="BOQ Builder" moduleDescription="Bill of quantities and cost estimation by client" basePath="/boq" statLabels={{ items: "boq", itemLabel: "BOQs" }}>
        {({ clientId }) => (<>
            <div className="boq-list-page__actions">
              <BoqHeaderActions clientId={clientId}/>
            </div>
            <BoqClientView clientId={clientId}/>
          </>)}
      </ClientWorkspaceShell>
    </Suspense>);
}
