"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Select } from "@/components/common/Select";
import { getProjectsForClient } from "@/lib/client-workspace";
import { addDrawing } from "@/lib/store/drawing-store";
import "@/assets/styles/components/DrawingUploadDialog.scss";

const DRAWING_TYPES = ["floor_plan", "3d_render", "mood_board", "cad"];

export function DrawingUploadDialog({ open, onOpenChange, clientId, onUploaded }) {
    const projects = getProjectsForClient(clientId);
    const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
    const [name, setName] = useState("");
    const [type, setType] = useState("floor_plan");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!projectId || !name.trim()) {
            toast.error("Project and file name are required");
            return;
        }
        addDrawing({ projectId, name: name.trim(), type });
        toast.success("Drawing uploaded", { description: `${name} added as draft v1.0` });
        onUploaded();
        onOpenChange(false);
        setName("");
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="drawing-upload-dialog__content">
        <DialogHeader>
          <DialogTitle>Upload Drawing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="drawing-upload-dialog__form">
          <div className="drawing-upload-dialog__field">
            <Label>Project</Label>
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </Select>
          </div>
          <div className="drawing-upload-dialog__field">
            <Label>File name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ground Floor Plan v2.5"/>
          </div>
          <div className="drawing-upload-dialog__field">
            <Label>Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {DRAWING_TYPES.map((t) => (<option key={t} value={t}>{t.replace("_", " ")}</option>))}
            </Select>
          </div>
          <div className="drawing-upload-dialog__actions">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}
