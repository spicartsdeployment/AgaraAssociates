import { useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
    ArrowLeft,
    UploadCloud,
    Eye,
    Download,
    Trash2,
    MoreVertical,
} from "lucide-react";
import { getProjectByIdFromStore } from "@/lib/store/project-store";
import { getDrawingsByProjectId } from "@/lib/store/drawing-store";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import "@/assets/styles/pages/DesignFolderPage.scss";

const FOLDER_CONFIG = {
    concept_design: { label: "Concept Design", description: "Conceptual designs and sketches" },
    floor_plan: { label: "Floor Plans", description: "Floor plan layouts and dimensions" },
    furniture_layout: { label: "Furniture Layout", description: "Furniture and space planning" },
    electrical_layout: { label: "Electrical Layout", description: "Electrical plans and schematics" },
    plumbing_layout: { label: "Plumbing Layout", description: "Plumbing plans and specifications" },
    ceiling_layout: { label: "Ceiling Layout", description: "Ceiling designs and layouts" },
    elevation: { label: "Elevations", description: "Front, side and elevation drawings" },
    section: { label: "Sections", description: "Cross sections and details" },
    working_drawing: { label: "Working Drawings", description: "Detailed working drawings" },
    structural_drawing: { label: "Structural Drawings", description: "Structural plans and details" },
    approval_drawing: { label: "Approval Drawings", description: "Municipal approval drawings" },
    "3d_render": { label: "3D Renders", description: "3D visualizations" },
    walkthrough_video: { label: "Walkthrough Videos", description: "Project walkthroughs" },
};

function formatDate(dateValue) {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

export function DesignFolderPage() {
    const { projectId, folderId } = useParams();
    const project = getProjectByIdFromStore(projectId);
    const allDrawings = getDrawingsByProjectId(projectId);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");

    if (!project) {
        return <Navigate to="/app/projects" replace />;
    }

    const folderConfig = FOLDER_CONFIG[folderId] || {
        label: folderId.replace(/_/g, " "),
        description: "Design folder",
    };

    const folderFiles = useMemo(() => {
        const files = allDrawings.filter((drawing) => drawing.type === folderId);

        // Search filter
        const filtered = files.filter((file) =>
            file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (file.description || "").toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort
        if (sortBy === "name") {
            return filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "date") {
            return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        return filtered;
    }, [allDrawings, folderId, searchTerm, sortBy]);

    const handleDeleteFile = (fileId, fileName) => {
        toast.success(`"${fileName}" deleted`);
    };

    return (
        <div className="design-folder">
            {/* Header */}
            <div className="design-folder__header">
                <Link
                    to={`/app/projects/${projectId}/designs`}
                    className="design-folder__back-link"
                >
                    <ArrowLeft size={20} />
                    Back to Design Library
                </Link>

                <PageHeader
                    title={folderConfig.label}
                    description={folderConfig.description}
                >
                    <Button variant="secondary" size="sm">
                        <UploadCloud size={16} />
                        Upload File
                    </Button>
                </PageHeader>
            </div>

            {/* Filters */}
            <div className="design-folder__controls">
                <input
                    type="text"
                    placeholder="Search files..."
                    className="design-folder__search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="design-folder__sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                </select>
            </div>

            {/* File Grid */}
            {folderFiles.length > 0 ? (
                <div className="design-folder__file-grid">
                    {folderFiles.map((file) => (
                        <Card key={file.id} className="design-folder__file-card">
                            <div className="design-folder__file-preview">
                                <span className="design-folder__file-type">
                                    {file.type.replace(/_/g, " ")}
                                </span>
                            </div>

                            <CardContent className="design-folder__file-content">
                                <div className="design-folder__file-info">
                                    <h4 className="design-folder__file-name">{file.name}</h4>
                                    {file.description && (
                                        <p className="design-folder__file-description">
                                            {file.description}
                                        </p>
                                    )}
                                    <p className="design-folder__file-meta">
                                        {file.version} · {formatDate(file.updatedAt)}
                                    </p>
                                    <p className="design-folder__file-uploader">
                                        By {file.uploadedBy || "Unknown"}
                                    </p>
                                </div>

                                <div className="design-folder__file-status">
                                    <Badge variant={getStatusVariant(file.status)}>
                                        {formatStatus(file.status)}
                                    </Badge>
                                </div>

                                <div className="design-folder__file-actions">
                                    <button
                                        type="button"
                                        className="design-folder__action-button"
                                        title="Preview"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        className="design-folder__action-button"
                                        title="Download"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        className="design-folder__action-button design-folder__action-button--danger"
                                        title="Delete"
                                        onClick={() => handleDeleteFile(file.id, file.name)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="design-folder__empty-state">
                    <UploadCloud size={48} />
                    <h3>No files in this folder</h3>
                    <p>Upload your first file to get started.</p>
                    <Button>
                        <UploadCloud size={16} />
                        Upload File
                    </Button>
                </div>
            )}
        </div>
    );
}

function getStatusVariant(status) {
    if (status === "approved") return "success";
    if (["review", "under_review", "pending_client", "revision_required"].includes(status))
        return "warning";
    return "secondary";
}

function formatStatus(status) {
    const statusMap = {
        draft: "Draft",
        under_review: "Under Review",
        pending_client: "Client Review",
        revision_required: "Revision Required",
        approved: "Approved",
    };
    return statusMap[status] || status.replace(/_/g, " ");
}
