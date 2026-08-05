"use client";
import { useState } from "react";
import { getDrawingsForClient } from "@/lib/client-workspace";
import { DrawingUploadDialog } from "@/components/organisms/drawing-upload-dialog";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Upload, FileCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@/assets/styles/components/DesignStudioClientView.scss";

const types = ["all", "floor_plan", "3d_render", "mood_board", "cad"];

export function DesignStudioClientView({ clientId }) {
    const [version, setVersion] = useState(0);
    const [uploadOpen, setUploadOpen] = useState(false);
    void version;
    const drawings = getDrawingsForClient(clientId);
    return (<>
      <div className="design-studio-client-view__toolbar">
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="design-studio-client-view__alert-icon"/> Upload Drawing
        </Button>
      </div>

      <DrawingUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} clientId={clientId} onUploaded={() => setVersion((v) => v + 1)}/>
      {drawings.length > 0 && (<Card className="design-studio-client-view__alert-card">
          <CardContent className="design-studio-client-view__alert-content">
            <FileCheck className="design-studio-client-view__alert-icon"/>
            <p className="design-studio-client-view__alert-text">
              <strong>Pending Review:</strong> {drawings.filter((d) => d.status === "pending_client" || d.status === "review").length} file(s) awaiting client sign-off for this workspace.
            </p>
          </CardContent>
        </Card>)}

      {drawings.length === 0 ? (<Card className="design-studio-client-view__empty-card">
          <CardContent className="design-studio-client-view__empty-content">
            <p className="design-studio-client-view__empty-title">No design files for this client</p>
            <p className="design-studio-client-view__empty-subtitle">Upload drawings or link them to this client&apos;s projects.</p>
          </CardContent>
        </Card>) : (<Tabs defaultValue="all">
          <TabsList>
            {types.map((t) => (<TabsTrigger key={t} value={t} className="design-studio-client-view__tab-trigger">
                {t === "all" ? "All Files" : t.replace("_", " ")}
              </TabsTrigger>))}
          </TabsList>
          {types.map((t) => (<TabsContent key={t} value={t} className="design-studio-client-view__tab-content">
              <div className="design-studio-client-view__grid">
                {drawings
                    .filter((d) => t === "all" || d.type === t)
                    .map((d) => (<Card key={d.id} className="design-studio-client-view__file-card">
                      <CardContent className="design-studio-client-view__file-content">
                        <div className="design-studio-client-view__file-preview">
                          <span className="design-studio-client-view__file-type">
                            {d.type.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <div className="design-studio-client-view__file-body">
                          <p className="design-studio-client-view__file-name">{d.name}</p>
                          <div className="design-studio-client-view__file-meta">
                            <span className="design-studio-client-view__file-version">{d.version}</span>
                            <Badge variant={d.status === "approved"
                        ? "success"
                        : d.status === "pending_client"
                            ? "warning"
                            : "outline"}>
                              {d.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>))}
              </div>
            </TabsContent>))}
        </Tabs>)}
    </>);
}
