import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    FolderOpen,
    FolderPlus,
    MoreVertical,
    Trash2,
    Edit2,
    ArrowLeft,
} from "lucide-react";
import { getProjectByIdFromStore } from "@/lib/store/project-store";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { CreateDesignFolderModal } from "@/components/modals/create-design-folder-modal";
import "@/assets/styles/pages/DesignLibraryPage.scss";

const DESIGN_FOLDER_TEMPLATES = [
    { id: "concept_design", label: "Concept Design", description: "Conceptual designs and sketches", icon: "📐" },
    { id: "floor_plan", label: "Floor Plans", description: "Floor plan layouts and dimensions", icon: "📐" },
    { id: "furniture_layout", label: "Furniture Layout", description: "Furniture and space planning", icon: "🛋️" },
    { id: "electrical_layout", label: "Electrical Layout", description: "Electrical plans and schematics", icon: "⚡" },
    { id: "plumbing_layout", label: "Plumbing Layout", description: "Plumbing plans and specifications", icon: "🚰" },
    { id: "ceiling_layout", label: "Ceiling Layout", description: "Ceiling designs and layouts", icon: "🎨" },
    { id: "elevation", label: "Elevations", description: "Front, side and elevation drawings", icon: "🏢" },
    { id: "section", label: "Sections", description: "Cross sections and details", icon: "📋" },
    { id: "working_drawing", label: "Working Drawings", description: "Detailed working drawings", icon: "📄" },
    { id: "structural_drawing", label: "Structural Drawings", description: "Structural plans and details", icon: "🏗️" },
    { id: "approval_drawing", label: "Approval Drawings", description: "Municipal approval drawings", icon: "✅" },
    { id: "3d_render", label: "3D Renders", description: "3D visualizations", icon: "🎬" },
    { id: "walkthrough_video", label: "Walkthrough Videos", description: "Project walkthroughs", icon: "🎥" },
];

export function DesignLibraryPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [folders, setFolders] = useState(() =>
        DESIGN_FOLDER_TEMPLATES.map((template) => ({
            ...template,
            fileCount: Math.floor(Math.random() * 12),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }))
    );

    const project = getProjectByIdFromStore(projectId);

    if (!project) {
        return <Navigate to="/app/projects" replace />;
    }

    const handleCreateFolder = (folderData) => {
        const newFolder = {
            id: `custom-${Date.now()}`,
            label: folderData.name,
            description: folderData.description,
            icon: "📁",
            fileCount: 0,
            createdAt: new Date().toISOString(),
            isCustom: true,
        };
        setFolders((prev) => [newFolder, ...prev]);
        setIsCreateModalOpen(false);
        toast.success(`Folder "${folderData.name}" created successfully`);
    };

    const handleDeleteFolder = (folderId) => {
        const folder = folders.find((f) => f.id === folderId);
        setFolders((prev) => prev.filter((f) => f.id !== folderId));
        toast.success(`Folder "${folder?.label}" deleted`);
    };

    const handleRenameFolder = (folderId) => {
        toast.info("Rename folder - Feature coming soon");
    };

    return (
        <div className="design-library">
            {/* Header */}
            <div className="design-library__header">
                <Link to={`/app/projects/${projectId}`} className="design-library__back-link">
                    <ArrowLeft size={20} />
                </Link>
                <PageHeader title="Design Library" description="Manage all project design files and documents.">
                    <div className="design-library__actions">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <FolderPlus size={16} />
                            Create Folder
                        </Button>
                    </div>
                </PageHeader>
            </div>

            {/* Folder Grid */}
            <div className="design-library__folders-grid">
                {folders.map((folder) => (
                    <div key={folder.id} className="design-library__folder-card">
                        <Link
                            to={`/app/projects/${projectId}/designs/${folder.id}`}
                            className="design-library__folder-link"
                        >
                            <div className="design-library__folder-icon">
                                {folder.icon}
                            </div>
                            <div className="design-library__folder-info">
                                <h3 className="design-library__folder-name">{folder.label}</h3>
                                <p className="design-library__folder-description">{folder.description}</p>
                                <p className="design-library__folder-count">
                                    {folder.fileCount} {folder.fileCount === 1 ? "file" : "files"}
                                </p>
                            </div>
                        </Link>

                        {folder.isCustom && (
                            <div className="design-library__folder-actions">
                                <button
                                    type="button"
                                    className="design-library__action-button"
                                    title="More options"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <MoreVertical size={18} />
                                    <div className="design-library__dropdown-menu">
                                        <button
                                            className="design-library__dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRenameFolder(folder.id);
                                            }}
                                        >
                                            <Edit2 size={16} /> Rename
                                        </button>
                                        <button
                                            className="design-library__dropdown-item design-library__dropdown-item--danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteFolder(folder.id);
                                            }}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {folders.length === 0 && (
                <div className="design-library__empty-state">
                    <FolderOpen size={48} />
                    <h3>No design folders</h3>
                    <p>Create your first folder to start organizing design documents.</p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <FolderPlus size={16} />
                        Create Folder
                    </Button>
                </div>
            )}

            {/* Create Folder Modal */}
            <CreateDesignFolderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateFolder={handleCreateFolder}
            />
        </div>
    );
}
