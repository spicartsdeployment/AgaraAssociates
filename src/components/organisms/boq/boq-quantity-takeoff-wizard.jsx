"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Calculator, ClipboardList, Plus, Trash2 } from "lucide-react";
import { getProjectsForClient } from "@/lib/client-workspace";
import { getProjectByIdFromStore, createBoq } from "@/lib/store/project-store";
import { PROJECT_TYPE_OPTIONS, DEFAULT_ROOM_ROW, computeRoomAreas, getTakeoffTemplate, } from "@/lib/boq/takeoff-templates";
import { buildTakeoffSnapshot, generateBoqLinesFromTakeoff, } from "@/lib/boq/generate-boq-from-takeoff";
import { calculateBoqEstimate } from "@/lib/boq/estimate-calculator";
import { useMaterialCatalog } from "@/lib/hooks/use-material-catalog";
import { generateQuotationFromBoq } from "@/lib/boq/generate-quotation-from-boq";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Select } from "@/components/common/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/common/Badge";
import { formatCurrency } from "@/lib/utils";
import "@/assets/styles/components/BoqQuantityTakeoffWizard.scss";

const STEPS = ["Setup", "Quantities", "Room Schedule", "Review & Estimate"];

export function BoqQuantityTakeoffWizard({ clientId }) {
    const navigate = useNavigate();
    const { catalog } = useMaterialCatalog();
    const projects = getProjectsForClient(clientId);
    const [step, setStep] = useState(0);
    const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
    const [title, setTitle] = useState("");
    const [projectType, setProjectType] = useState(projects[0]?.type ?? "residential");
    const [quantities, setQuantities] = useState({});
    const [rooms, setRooms] = useState([DEFAULT_ROOM_ROW()]);
    const [materialOverrides, setMaterialOverrides] = useState({});

    // Horizontal tab scroll — track edge positions for fade indicators
    const tabsScrollRef = useRef(null);
    const [scrollEdge, setScrollEdge] = useState({ atStart: true, atEnd: false });
    const handleTabsScroll = useCallback(() => {
        const el = tabsScrollRef.current;
        if (!el) return;
        const atStart = el.scrollLeft <= 4;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setScrollEdge({ atStart, atEnd });
    }, []);
    // Measure initial edge state once the list is mounted
    useEffect(() => { handleTabsScroll(); }, [handleTabsScroll]);
    const template = useMemo(() => getTakeoffTemplate(projectType), [projectType]);
    const snapshot = useMemo(() => buildTakeoffSnapshot({ projectType, quantities, rooms, materialOverrides }), [projectType, quantities, rooms, materialOverrides]);
    const previewLines = useMemo(() => (catalog ? generateBoqLinesFromTakeoff(snapshot, catalog) : []), [snapshot, catalog]);
    const estimate = useMemo(() => calculateBoqEstimate(previewLines), [previewLines]);
    const setQty = (fieldId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [fieldId]: value === "" ? 0 : Number(value),
        }));
    };
    const updateRoom = (id, patch) => {
        setRooms((prev) => prev.map((r) => {
            if (r.id !== id)
                return r;
            const next = { ...r, ...patch };
            if ("length" in patch || "width" in patch || "height" in patch) {
                const areas = computeRoomAreas(next.length, next.width, next.height);
                next.floorArea = areas.floorArea;
                next.wallArea = areas.wallArea;
                next.ceilingArea = areas.ceilingArea;
                next.flooringQty = areas.floorArea;
                next.paintQty = areas.wallArea;
                next.falseCeilingQty = areas.ceilingArea;
            }
            return next;
        }));
    };
    const handleGenerate = (alsoQuotation) => {
        if (!projectId || !title.trim()) {
            toast.error("Select project and enter BOQ title");
            return;
        }
        if (previewLines.length === 0) {
            toast.error("Enter at least one quantity to generate estimate");
            return;
        }
        const boq = createBoq({
            projectId,
            title: title.trim(),
            items: previewLines,
            projectType,
            takeoffSnapshot: snapshot,
        });
        if (alsoQuotation) {
            const quote = generateQuotationFromBoq(boq, "by_trade");
            toast.success("BOQ and quotation created", {
                description: `${previewLines.length} line items · ${formatCurrency(estimate.grandTotal)}`,
            });
            navigate(`/quotations/${quote.id}?client=${clientId}`);
            return;
        }
        toast.success("BOQ estimate generated", {
            description: `${previewLines.length} items from material library pricing`,
        });
        navigate(`/boq/${boq.id}?client=${clientId}`);
    };
    const onProjectChange = (id) => {
        setProjectId(id);
        const project = getProjectByIdFromStore(id);
        if (project?.type)
            setProjectType(project.type);
    };
    return (
        <div className="boq-quantity-takeoff-wizard">
            <Link to={`/boq?client=${clientId}`} className="boq-quantity-takeoff-wizard__back-link">
                <ArrowLeft className="boq-quantity-takeoff-wizard__back-icon" /> Back to BOQ
            </Link>

            <PageHeader title="Bill of Quantities — Quantity Takeoff" description="Fill building quantities by trade. Rates are pulled from the Master Material Library to generate your estimate." />

            <div className="boq-quantity-takeoff-wizard__steps">
                {STEPS.map((label, i) => (
                    <Badge key={label} variant={step === i ? "default" : step > i ? "secondary" : "outline"} className="boq-quantity-takeoff-wizard__step-badge">
                        {i + 1}. {label}
                    </Badge>
                ))}
            </div>

            {step === 0 && (
                <Card>
                    <CardHeader><CardTitle>Project Setup</CardTitle></CardHeader>
                    <CardContent className="boq-quantity-takeoff-wizard__setup-grid">
                        <div className="boq-quantity-takeoff-wizard__field boq-quantity-takeoff-wizard__field--full">
                            <Label>Project</Label>
                            <Select value={projectId} onChange={(e) => onProjectChange(e.target.value)} className="boq-quantity-takeoff-wizard__select">
                                {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                            </Select>
                        </div>
                        <div className="boq-quantity-takeoff-wizard__field boq-quantity-takeoff-wizard__field--full">
                            <Label>BOQ Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ground Floor — Full Interior BOQ" className="boq-quantity-takeoff-wizard__input" />
                        </div>
                        <div className="boq-quantity-takeoff-wizard__field">
                            <Label>Project Type</Label>
                            <Select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="boq-quantity-takeoff-wizard__select">
                                {PROJECT_TYPE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                            </Select>
                            <p className="boq-quantity-takeoff-wizard__hint">
                                Form fields adapt to {template.label.toLowerCase()} projects
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="boq-quantity-takeoff-wizard__section-title">
                            <ClipboardList className="boq-quantity-takeoff-wizard__section-icon" /> Trade Quantities
                        </CardTitle>
                        <p className="boq-quantity-takeoff-wizard__section-desc">
                            Enter measured quantities for civil, flooring, walls, paint, MEP, and fit-out items
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={template.sections[0]?.id}>
                            <div
                                className={[
                                    "boq-quantity-takeoff-wizard__tabs-scroll-wrapper",
                                    scrollEdge.atStart ? "boq-quantity-takeoff-wizard__tabs-scroll-wrapper--at-start" : "",
                                    scrollEdge.atEnd ? "boq-quantity-takeoff-wizard__tabs-scroll-wrapper--at-end" : "",
                                ].join(" ")}
                            >
                                <TabsList
                                    ref={tabsScrollRef}
                                    className="boq-quantity-takeoff-wizard__tabs-list"
                                    onScroll={handleTabsScroll}
                                >
                                    {template.sections.map((s) => (
                                        <TabsTrigger key={s.id} value={s.id} className="boq-quantity-takeoff-wizard__tab-trigger">
                                            {s.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            {template.sections.map((section) => (
                                <TabsContent key={section.id} value={section.id} className="boq-quantity-takeoff-wizard__tab-content">
                                    {section.description && (
                                        <p className="boq-quantity-takeoff-wizard__section-desc">{section.description}</p>
                                    )}
                                    <div className="boq-quantity-takeoff-wizard__table-wrap">
                                        <table className="boq-quantity-takeoff-wizard__table">
                                            <thead>
                                                <tr className="boq-quantity-takeoff-wizard__thead-row">
                                                    <th className="boq-quantity-takeoff-wizard__th boq-quantity-takeoff-wizard__th--item">Item</th>
                                                    <th className="boq-quantity-takeoff-wizard__th boq-quantity-takeoff-wizard__th--qty">Quantity</th>
                                                    <th className="boq-quantity-takeoff-wizard__th boq-quantity-takeoff-wizard__th--unit">Unit</th>
                                                    <th className="boq-quantity-takeoff-wizard__th boq-quantity-takeoff-wizard__th--material">Material (Library)</th>
                                                    <th className="boq-quantity-takeoff-wizard__th boq-quantity-takeoff-wizard__th--rate">Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.fields.map((field) => {
                                                    const qty = quantities[field.id] ?? 0;
                                                    const materials = catalog?.getMaterialsForField(field) ?? [];
                                                    const selectedMaterialId = materialOverrides[field.id] ?? materials[0]?.id;
                                                    const material = catalog?.findMaterialForField(field, selectedMaterialId);
                                                    return (
                                                        <tr key={field.id} className="boq-quantity-takeoff-wizard__tbody-row">
                                                            <td className="boq-quantity-takeoff-wizard__td">
                                                                <p className="boq-quantity-takeoff-wizard__field-label">{field.label}</p>
                                                                {field.helpText && (
                                                                    <p className="boq-quantity-takeoff-wizard__field-help">{field.helpText}</p>
                                                                )}
                                                            </td>
                                                            <td className="boq-quantity-takeoff-wizard__td">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    value={qty || ""}
                                                                    onChange={(e) => setQty(field.id, e.target.value)}
                                                                    className="boq-quantity-takeoff-wizard__cell-input"
                                                                    placeholder={field.placeholder ?? "0"}
                                                                />
                                                            </td>
                                                            <td className="boq-quantity-takeoff-wizard__td boq-quantity-takeoff-wizard__td--muted">{field.unit}</td>
                                                            <td className="boq-quantity-takeoff-wizard__td">
                                                                {materials.length > 0 ? (
                                                                    <Select
                                                                        value={selectedMaterialId ?? ""}
                                                                        onChange={(e) => setMaterialOverrides((prev) => ({
                                                                            ...prev,
                                                                            [field.id]: e.target.value,
                                                                        }))}
                                                                        className="boq-quantity-takeoff-wizard__cell-select"
                                                                    >
                                                                        {materials.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                                                                    </Select>
                                                                ) : (
                                                                    <span className="boq-quantity-takeoff-wizard__no-match">No catalog match</span>
                                                                )}
                                                            </td>
                                                            <td className="boq-quantity-takeoff-wizard__td boq-quantity-takeoff-wizard__td--right">
                                                                {material ? `₹${material.currentPrice}` : "—"}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader className="boq-quantity-takeoff-wizard__room-header">
                        <div className="boq-quantity-takeoff-wizard__room-header-text">
                            <CardTitle>Room-wise Schedule</CardTitle>
                            <p className="boq-quantity-takeoff-wizard__room-desc">
                                Optional per-room breakdown — floor, wall, and ceiling areas auto-calculate from dimensions
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="boq-quantity-takeoff-wizard__add-room-btn" onClick={() => setRooms((prev) => [...prev, DEFAULT_ROOM_ROW()])}>
                            <Plus className="boq-quantity-takeoff-wizard__add-room-icon" /> Add Room
                        </Button>
                    </CardHeader>
                    <CardContent className="boq-quantity-takeoff-wizard__room-table-wrap">
                        <table className="boq-quantity-takeoff-wizard__room-table">
                            <thead>
                                <tr className="boq-quantity-takeoff-wizard__room-thead-row">
                                    <th className="boq-quantity-takeoff-wizard__room-th">Room</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Floor</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">L (ft)</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">W (ft)</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">H (ft)</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Floor Area</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Wall Area</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Ceiling</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Flooring Qty</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Paint Qty</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">False Ceiling</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th">Wall Tiles</th>
                                    <th className="boq-quantity-takeoff-wizard__room-th" />
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.id} className="boq-quantity-takeoff-wizard__room-row">
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input value={room.name} onChange={(e) => updateRoom(room.id, { name: e.target.value })} placeholder="Living Room" className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--name" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input value={room.floor} onChange={(e) => updateRoom(room.id, { floor: e.target.value })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--floor" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.length || ""} onChange={(e) => updateRoom(room.id, { length: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--dim" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.width || ""} onChange={(e) => updateRoom(room.id, { width: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--dim" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.height || ""} onChange={(e) => updateRoom(room.id, { height: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--dim" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td boq-quantity-takeoff-wizard__room-td--readonly">{room.floorArea}</td>
                                        <td className="boq-quantity-takeoff-wizard__room-td boq-quantity-takeoff-wizard__room-td--readonly">{room.wallArea}</td>
                                        <td className="boq-quantity-takeoff-wizard__room-td boq-quantity-takeoff-wizard__room-td--readonly">{room.ceilingArea}</td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.flooringQty || ""} onChange={(e) => updateRoom(room.id, { flooringQty: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--qty" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.paintQty || ""} onChange={(e) => updateRoom(room.id, { paintQty: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--qty" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.falseCeilingQty || ""} onChange={(e) => updateRoom(room.id, { falseCeilingQty: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--qty" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Input type="number" value={room.wallTilesQty || ""} onChange={(e) => updateRoom(room.id, { wallTilesQty: Number(e.target.value) })} className="boq-quantity-takeoff-wizard__room-input boq-quantity-takeoff-wizard__room-input--qty" />
                                        </td>
                                        <td className="boq-quantity-takeoff-wizard__room-td">
                                            <Button variant="ghost" size="icon" className="boq-quantity-takeoff-wizard__delete-btn" onClick={() => setRooms((prev) => prev.filter((r) => r.id !== room.id))} disabled={rooms.length <= 1}>
                                                <Trash2 className="boq-quantity-takeoff-wizard__delete-icon" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <div className="boq-quantity-takeoff-wizard__review-grid">
                    <div className="boq-quantity-takeoff-wizard__review-main">
                        <Card>
                            <CardHeader>
                                <CardTitle className="boq-quantity-takeoff-wizard__section-title">
                                    <Calculator className="boq-quantity-takeoff-wizard__section-icon" /> Generated Estimate ({previewLines.length} lines)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="boq-quantity-takeoff-wizard__estimate-table-wrap">
                                <table className="boq-quantity-takeoff-wizard__table">
                                    <thead className="boq-quantity-takeoff-wizard__estimate-thead">
                                        <tr className="boq-quantity-takeoff-wizard__thead-row">
                                            <th className="boq-quantity-takeoff-wizard__th">Room / Area</th>
                                            <th className="boq-quantity-takeoff-wizard__th">Material</th>
                                            <th className="boq-quantity-takeoff-wizard__th">Qty</th>
                                            <th className="boq-quantity-takeoff-wizard__th">Rate</th>
                                            <th className="boq-quantity-takeoff-wizard__th">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewLines.map((line) => {
                                            const lineEst = calculateBoqEstimate([line]).grandTotal;
                                            return (
                                                <tr key={line.id} className="boq-quantity-takeoff-wizard__tbody-row">
                                                    <td className="boq-quantity-takeoff-wizard__td">{line.room}</td>
                                                    <td className="boq-quantity-takeoff-wizard__td">
                                                        <p className="boq-quantity-takeoff-wizard__estimate-name">{line.item}</p>
                                                        {line.sku && <p className="boq-quantity-takeoff-wizard__estimate-sku">{line.sku}</p>}
                                                    </td>
                                                    <td className="boq-quantity-takeoff-wizard__td boq-quantity-takeoff-wizard__td--right">{line.quantity} {line.unit}</td>
                                                    <td className="boq-quantity-takeoff-wizard__td boq-quantity-takeoff-wizard__td--right">₹{line.rate}</td>
                                                    <td className="boq-quantity-takeoff-wizard__td boq-quantity-takeoff-wizard__td--right">{formatCurrency(lineEst)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {previewLines.length === 0 && (
                                    <p className="boq-quantity-takeoff-wizard__estimate-empty">No quantities entered yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="boq-quantity-takeoff-wizard__summary-card">
                        <CardHeader><CardTitle>Estimate Summary</CardTitle></CardHeader>
                        <CardContent className="boq-quantity-takeoff-wizard__summary-body">
                            <div className="boq-quantity-takeoff-wizard__summary-row">
                                <span className="boq-quantity-takeoff-wizard__summary-label">Subtotal</span>
                                <span>{formatCurrency(estimate.subtotal)}</span>
                            </div>
                            <div className="boq-quantity-takeoff-wizard__summary-row">
                                <span className="boq-quantity-takeoff-wizard__summary-label">GST</span>
                                <span>{formatCurrency(estimate.gst)}</span>
                            </div>
                            <div className="boq-quantity-takeoff-wizard__summary-row">
                                <span className="boq-quantity-takeoff-wizard__summary-label">Labour</span>
                                <span>{formatCurrency(estimate.labour)}</span>
                            </div>
                            <div className="boq-quantity-takeoff-wizard__summary-row">
                                <span className="boq-quantity-takeoff-wizard__summary-label">Margin</span>
                                <span>{formatCurrency(estimate.margin)}</span>
                            </div>
                            <div className="boq-quantity-takeoff-wizard__summary-total">
                                <span>Grand Total</span>
                                <span>{formatCurrency(estimate.grandTotal)}</span>
                            </div>
                            <p className="boq-quantity-takeoff-wizard__summary-note">
                                Pricing from Master Material Library · GST + labour + margin applied per line
                            </p>
                            <div className="boq-quantity-takeoff-wizard__summary-actions">
                                <Button className="boq-quantity-takeoff-wizard__summary-btn" onClick={() => handleGenerate(false)}>
                                    Save BOQ Estimate
                                </Button>
                                <Button variant="outline" className="boq-quantity-takeoff-wizard__summary-btn" onClick={() => handleGenerate(true)}>
                                    Save BOQ + Create Quotation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="boq-quantity-takeoff-wizard__nav">
                <Button variant="outline" className="boq-quantity-takeoff-wizard__nav-btn" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                    <ArrowLeft className="boq-quantity-takeoff-wizard__nav-icon" /> Previous
                </Button>
                {step < STEPS.length - 1 && (
                    <Button className="boq-quantity-takeoff-wizard__nav-btn" onClick={() => setStep((s) => s + 1)}>
                        Next <ArrowRight className="boq-quantity-takeoff-wizard__nav-icon" />
                    </Button>
                )}
            </div>
        </div>
    );
}
