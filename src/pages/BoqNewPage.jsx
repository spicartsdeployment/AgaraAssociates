import { Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BoqWizardClient } from "@/components/features/lazy-modules";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import "@/assets/styles/pages/BoqNewPage.scss";

function BoqNewContent() {
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get("client") ?? "";
    if (!clientId) {
        return (<div className="boq-new-page__empty">
        <Card className="boq-new-page__empty-card">
          <CardContent className="boq-new-page__empty-content">
            <p className="boq-new-page__empty-title">Select a client first</p>
            <p className="boq-new-page__empty-text">
              Open BOQ, pick a client workspace, then start a new takeoff.
            </p>
            <Button className="boq-new-page__empty-btn" asChild>
              <Link to="/boq">Go to BOQ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>);
    }
    return (<Suspense fallback={<div className="boq-new-page__loading">Loading wizard...</div>}>
      <BoqWizardClient clientId={clientId}/>
    </Suspense>);
}
export function BoqNewPage() {
    return (<Suspense fallback={<div className="boq-new-page__loading">Loading...</div>}>
      <BoqNewContent />
    </Suspense>);
}
