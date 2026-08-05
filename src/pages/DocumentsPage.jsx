import { getAllDocuments } from "@/lib/store/document-store";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { FileText, FolderOpen } from "lucide-react";
import "@/assets/styles/pages/DocumentsPage.scss";

export function DocumentsPage() {
    const documents = getAllDocuments();
    return (<div className="documents-page">
      <PageHeader title="Documents" description="Project files, contracts, drawings, and reports across your portfolio"/>

      <div className="documents-page__grid">
        {documents.map((doc) => (<Card key={doc.id}>
            <CardContent className="documents-page__card-content">
              <div className="documents-page__icon-wrap">
                {doc.type === "drawing" ? <FolderOpen className="documents-page__icon"/> : <FileText className="documents-page__icon"/>}
              </div>
              <div className="documents-page__info">
                <p className="documents-page__name">{doc.name}</p>
                <p className="documents-page__project">{doc.projectName}</p>
                <div className="documents-page__meta">
                  <Badge variant="outline" className="documents-page__type-badge">{doc.type}</Badge>
                  <span className="documents-page__date">{doc.updatedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>
    </div>);
}
