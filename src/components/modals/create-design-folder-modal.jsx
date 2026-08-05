import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import "@/assets/styles/modals/CreateDesignFolderModal.scss";

export function CreateDesignFolderModal({ isOpen, onClose, onCreateFolder }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "custom",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Folder name is required";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onCreateFolder(formData);
        setFormData({ name: "", description: "", type: "custom" });
        setErrors({});
    };

    const handleCancel = () => {
        setFormData({ name: "", description: "", type: "custom" });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="create-design-folder-modal__overlay" onClick={handleCancel}>
            <div
                className="create-design-folder-modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="create-design-folder-modal__header">
                    <h2 className="create-design-folder-modal__title">Create Design Folder</h2>
                    <button
                        type="button"
                        className="create-design-folder-modal__close"
                        onClick={handleCancel}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-design-folder-modal__form">
                    <div className="create-design-folder-modal__form-group">
                        <label htmlFor="name" className="create-design-folder-modal__label">
                            Folder Name <span className="create-design-folder-modal__required">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Custom Designs, Client Approvals"
                            className={`create-design-folder-modal__input ${errors.name ? "create-design-folder-modal__input--error" : ""}`}
                        />
                        {errors.name && (
                            <span className="create-design-folder-modal__error">{errors.name}</span>
                        )}
                    </div>

                    <div className="create-design-folder-modal__form-group">
                        <label htmlFor="description" className="create-design-folder-modal__label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add a description for this folder..."
                            rows={3}
                            className="create-design-folder-modal__textarea"
                        />
                    </div>

                    <div className="create-design-folder-modal__form-group">
                        <label htmlFor="type" className="create-design-folder-modal__label">
                            Folder Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="create-design-folder-modal__select"
                        >
                            <option value="custom">Custom</option>
                            <option value="construction">Construction</option>
                            <option value="interior">Interior</option>
                            <option value="architecture">Architecture</option>
                        </select>
                    </div>

                    <div className="create-design-folder-modal__actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="default">
                            Create Folder
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
