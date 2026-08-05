"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, X, Eye, Pencil,
  Building2, Sofa, Key, Compass, Trees, Hammer, BookOpen, Users,
  FileText, Upload, Save, ChevronRight, MapPin, Phone, User, Tag, AlignLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { Badge } from "@/components/common/Badge";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/ProjectCreationWizard.scss";

// ─── Step definitions ────────────────────────────────────────────────────────
const BASE_STEPS = ["Basic Information", "Select Services", "Review"];
const CONSTRUCTION_STEPS = ["Basic Information", "Select Services", "Construction Agreement", "Review"];

// ─── Project type options ─────────────────────────────────────────────────────
const PROJECT_TYPE_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
];

// ─── Service catalogue ────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "construction", icon: Building2, name: "Construction",
    description: "Residential and commercial building construction based on Standard, Premium or Luxury packages with per square foot pricing.",
    workflow: ["Agreement", "Execution", "Handover"],
  },
  {
    id: "interior_design", icon: Sofa, name: "Interior Design & Execution",
    description: "Complete interior design and execution including modular kitchen, wardrobes, false ceiling, painting, furniture and décor.",
    workflow: ["Requirements", "Measurements", "Design", "Material Selection", "BOQ", "Cost Estimate", "Quotation", "Execution"],
  },
  {
    id: "turnkey", icon: Key, name: "Turnkey Project",
    description: "Complete end-to-end solution including architecture, construction, interiors, execution and project handover under one contract.",
    workflow: ["Requirements", "Architecture Design", "Construction", "Interior Design", "Execution", "Project Handover"],
  },
  {
    id: "architecture", icon: Compass, name: "Architecture Design",
    description: "Architectural planning, floor plans, elevations, working drawings and approval drawings.",
    workflow: ["Brief", "Concept Design", "Design Development", "Working Drawings", "Approvals"],
  },
  {
    id: "landscape", icon: Trees, name: "Landscape Design",
    description: "Landscape planning, garden development, outdoor seating, paving and external beautification.",
    workflow: ["Site Analysis", "Concept", "Design", "Execution"],
  },
  {
    id: "renovation", icon: Hammer, name: "Renovation & Remodeling",
    description: "Renovation of existing residential or commercial spaces including structural and interior modifications.",
    workflow: ["Assessment", "Design", "Approvals", "Execution"],
  },
  {
    id: "structural", icon: BookOpen, name: "Structural Design",
    description: "Structural drawings, RCC detailing, foundation design and structural calculations.",
    workflow: ["Soil Report", "Analysis", "Detailing", "Drawings", "Certification"],
  },
  {
    id: "consultation", icon: Users, name: "Project Consultation",
    description: "Consultation for planning, budgeting, material selection and project management.",
    workflow: ["Discovery", "Planning", "Budgeting", "Recommendations"],
  },
];

const TURNKEY_WORKFLOW = [
  "Requirements", "Architecture Design", "Construction",
  "Interior Design", "Execution", "Project Handover",
];

function buildWorkflowPreview(selectedIds) {
  if (selectedIds.includes("turnkey")) {
    return [{ serviceId: "turnkey", label: "Turnkey Project", steps: TURNKEY_WORKFLOW }];
  }
  return SERVICES.filter((s) => selectedIds.includes(s.id)).map((s) => ({
    serviceId: s.id, label: s.name, steps: s.workflow,
  }));
}

// ─── Construction packages ────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    rate: 2100,
    badge: null,
    color: "teal",
    tagline: "Solid construction with reliable materials",
    highlights: ["Ultra Tech Cement", "Jai Raj Steel Fe 550D", "River Sand / Dust", "Parry ware / Hindware Bath", "UPVC 2-Track Windows", "Asian Premier Exterior Paint"],
  },
  {
    id: "standard",
    name: "Standard",
    rate: 2500,
    badge: "Most Popular",
    color: "primary",
    tagline: "Enhanced finishes and premium brands",
    highlights: ["Ultra Tech Cement", "Jai Raj Steel Fe 550D", "River Sand", "Cera Sanitary Ware", "UPVC 3-Track Windows", "Asian Weather Proof Paint"],
  },
  {
    id: "premium",
    name: "Premium",
    rate: 3000,
    badge: "Best",
    color: "gold",
    tagline: "Luxury materials and top-tier finishes",
    highlights: ["Ultra Tech Cement", "Tata Steel Fe 550D", "River Sand", "Jaguar / Kohler Sanitary", "UPVC 3-Track + MS Grill", "Apex Ultima Weather Proof"],
  },
];

// ─── Full agreement spec data (from rate card document) ──────────────────────
const AGREEMENT_SPEC = {
  basic: {
    sections: [
      {
        title: "Structure", items: [
          { item: "Cement", spec: "Ultra Tech" },
          { item: "Steel", spec: "Jai Raj (Fe 550 D)" },
          { item: "Sand", spec: "River Sand OR Dust" },
          { item: "Aggregates", spec: "20 mm & 40 mm" },
          { item: "Brick Work", spec: "Red Brick Light Weight" },
          { item: "RCC Design Mix", spec: "As per Structural Engineer Recommendations" },
          { item: "Water Proofing", spec: "Dr Fixit / Fosroc" },
        ]
      },
      {
        title: "Kitchen", items: [
          { item: "Ceramic Wall Tiles", spec: "9mm Thick — 2' above Kitchen Slab" },
          { item: "Main Sink Faucet", spec: "Upto ₹1,800/- with ISI Mark" },
          { item: "Kitchen Sink", spec: "304 Stainless Steel upto ₹3,500/-" },
          { item: "Kitchen Granite", spec: "Slab 15mm thick (granite)" },
        ]
      },
      {
        title: "Bathroom", items: [
          { item: "Ceramic Wall Tiles", spec: "Upto 7' ht (4'×2\")" },
          { item: "Sanitary Ware & Accessories", spec: "Upto ₹17,500/- per washroom" },
          { item: "Brand", spec: "Parry ware or Hindware or equivalent" },
          { item: "CPVC Pipes", spec: "Sudhakar" },
          { item: "Bathroom Door", spec: "Water Proof Flush Door upto ₹5,000/- incl. frame" },
        ]
      },
      {
        title: "Doors & Windows", items: [
          { item: "Main Door", spec: "African Teak Frame 7'×3'-6\", 100mm, Flush door with fixtures" },
          { item: "Internal Door", spec: "Flush Door with laminates, SAL Wood Frame 4\"×3\"" },
          { item: "Windows", spec: "UPVC 2 Track" },
          { item: "Pooja Room", spec: "No Door" },
        ]
      },
      {
        title: "Painting", items: [
          { item: "Interior", spec: "JK Wall Putty with Tractor Emulsion" },
          { item: "Exterior", spec: "Asian Premier with Ace Emulsion" },
        ]
      },
      {
        title: "Electrical", items: [
          { item: "Wires", spec: "Finecab" },
          { item: "Switches", spec: "Anchor Penta" },
        ]
      },
      {
        title: "Flooring", items: [
          { item: "Living & Dining", spec: "2'×4' size tile" },
          { item: "Rooms & Kitchen", spec: "2'×4' size tile" },
          { item: "Balcony & Open Area", spec: "2'×2' wooden tiles" },
          { item: "Staircase", spec: "Sadarahalli Granite" },
          { item: "Parking Tiles", spec: "Anti-Skid tile tandoor stone 2'×2' size" },
        ]
      },
      {
        title: "Other Inclusive", items: [
          { item: "Overhead Tank", spec: "Syntex 4 layer water tank" },
          { item: "Underground Sump", spec: "According design with RCC" },
          { item: "Staircase Railing", spec: "SS Railing" },
          { item: "False Ceiling", spec: "NO" },
          { item: "Rainwater Harvesting", spec: "No" },
        ]
      },
    ],
  },
  standard: {
    sections: [
      {
        title: "Structure", items: [
          { item: "Cement", spec: "Ultra Tech" },
          { item: "Steel", spec: "Jai Raj (Fe 550 D)" },
          { item: "Sand", spec: "River Sand" },
          { item: "Aggregates", spec: "20 mm & 40 mm" },
          { item: "Brick Work", spec: "Red Brick Light Weight" },
          { item: "RCC Design Mix", spec: "As per Structural Engineer Recommendations" },
          { item: "Water Proofing", spec: "Dr Fixit / Fosroc" },
        ]
      },
      {
        title: "Kitchen", items: [
          { item: "Ceramic Wall Tiles", spec: "9mm Thick — 2' above Kitchen Slab" },
          { item: "Main Sink Faucet", spec: "Upto ₹2,500/- with Parry ware or Hindware" },
          { item: "Kitchen Sink", spec: "Black Stainless Steel upto ₹5,500/-" },
          { item: "Kitchen Granite", spec: "Slab 15mm thick (full body tile)" },
        ]
      },
      {
        title: "Bathroom", items: [
          { item: "Ceramic Wall Tiles", spec: "Upto 8' ht (4'×2\")" },
          { item: "Sanitary Ware & Accessories", spec: "Upto ₹22,500/- per washroom" },
          { item: "Brand", spec: "Cera or equivalent" },
          { item: "CPVC Pipes", spec: "Ashirawad" },
          { item: "Bathroom Door", spec: "Water Proof Flush Door upto ₹7,000/- incl. frame" },
        ]
      },
      {
        title: "Doors & Windows", items: [
          { item: "Main Door", spec: "African Teak Frame 8'×3'-6\", 150mm, Flush door with fixtures" },
          { item: "Internal Door", spec: "Flush Door with laminates, SAL Wood Frame 4\"×3\"" },
          { item: "Windows", spec: "UPVC 3 Track" },
          { item: "Pooja Room", spec: "African Teak wood & Frame 4\"×3\" with fixtures" },
        ]
      },
      {
        title: "Painting", items: [
          { item: "Interior", spec: "Birla Putty with Asian Premium Emulsion" },
          { item: "Exterior", spec: "Asian Premier with Weather Proof Paint" },
        ]
      },
      {
        title: "Electrical", items: [
          { item: "Wires", spec: "Finecab or Polycab" },
          { item: "Switches", spec: "Gold Medal" },
        ]
      },
      {
        title: "Flooring", items: [
          { item: "Living & Dining", spec: "6'×4' size tile" },
          { item: "Rooms & Kitchen", spec: "6'×4' size tile" },
          { item: "Balcony & Open Area", spec: "4'×6\" wooden plank tiles" },
          { item: "Staircase", spec: "Lapatra finish granite" },
          { item: "Parking Tiles", spec: "Anti-Skid lapatra finish granite" },
        ]
      },
      {
        title: "Other Inclusive", items: [
          { item: "Overhead Tank", spec: "Syntex 8 layer water tank" },
          { item: "Underground Sump", spec: "According design with RCC" },
          { item: "Staircase Railing", spec: "SS Railing" },
          { item: "False Ceiling", spec: "NO" },
          { item: "Rainwater Harvesting", spec: "YES" },
        ]
      },
    ],
  },
  premium: {
    sections: [
      {
        title: "Structure", items: [
          { item: "Cement", spec: "Ultra Tech" },
          { item: "Steel", spec: "Tata (Fe 550 D)" },
          { item: "Sand", spec: "River Sand" },
          { item: "Aggregates", spec: "20 mm & 40 mm" },
          { item: "Brick Work", spec: "Red Brick Light Weight" },
          { item: "RCC Design Mix", spec: "As per Structural Engineer Recommendations" },
          { item: "Water Proofing", spec: "Dr Fixit / Fosroc" },
        ]
      },
      {
        title: "Kitchen", items: [
          { item: "Ceramic Wall Tiles", spec: "15mm Thick — 2' above Kitchen Slab" },
          { item: "Main Sink Faucet", spec: "Upto ₹4,000/- with Parry ware or Hindware" },
          { item: "Kitchen Sink", spec: "Quartz sink upto ₹7,500/-" },
          { item: "Kitchen Granite", spec: "Slab 15mm thick (quartz)" },
        ]
      },
      {
        title: "Bathroom", items: [
          { item: "Ceramic Wall Tiles", spec: "Upto 8' ht (4'×2\")" },
          { item: "Sanitary Ware & Accessories", spec: "Upto ₹37,500/- per washroom" },
          { item: "Brand", spec: "Jaguar / Kohler or equivalent" },
          { item: "CPVC Pipes", spec: "Astral" },
          { item: "Bathroom Door", spec: "Water Proof Flush Door upto ₹8,500/- incl. frame" },
        ]
      },
      {
        title: "Doors & Windows", items: [
          { item: "Main Door", spec: "Indian Teak Frame 8'×4'-6\", 210mm, Flush door with fixtures" },
          { item: "Internal Door", spec: "Veneer Flush Door with laminates, Granite frame 5\"×4\"" },
          { item: "Windows", spec: "UPVC 3 Track with MS grill" },
          { item: "Pooja Room", spec: "Indian Teak wood & Frame 4\"×3\" with fixtures" },
        ]
      },
      {
        title: "Painting", items: [
          { item: "Interior", spec: "Birla Putty with Asian Royal Emulsion" },
          { item: "Exterior", spec: "Apex Ultima with Weather Proof Paint" },
        ]
      },
      {
        title: "Electrical", items: [
          { item: "Wires", spec: "Havel's, KEI, Gold Medal" },
          { item: "Switches", spec: "Havel's" },
        ]
      },
      {
        title: "Flooring", items: [
          { item: "Living & Dining", spec: "Italian Marble Slab with polishing" },
          { item: "Rooms & Kitchen", spec: "Italian Marble Slab with polishing" },
          { item: "Balcony & Open Area", spec: "4'×6\" wooden planks" },
          { item: "Staircase", spec: "Granite or Marble" },
          { item: "Parking Tiles", spec: "Anti-Skid lapatra finish granite" },
        ]
      },
      {
        title: "Other Inclusive", items: [
          { item: "Overhead Tank", spec: "According design with RCC" },
          { item: "Underground Sump", spec: "According design with RCC" },
          { item: "Staircase Railing", spec: "SS Railing" },
          { item: "False Ceiling", spec: "Plain false ceiling without electrical" },
          { item: "Rainwater Harvesting", spec: "YES" },
        ]
      },
    ],
  },
};

// ─── Payment milestones ───────────────────────────────────────────────────────
const PAYMENT_MILESTONES = [
  { id: 1, label: "Milestone 1 — Foundation to Plinth", pct: 25 },
  { id: 2, label: "Milestone 2", pct: 25 },
  { id: 3, label: "Milestone 3", pct: 25 },
  { id: 4, label: "Milestone 4", pct: 20 },
  { id: 5, label: "Milestone 5 — Final Handover", pct: 5 },
];

// ─── Agreement Modal ──────────────────────────────────────────────────────────
function AgreementModal({ pkg, onClose }) {
  if (!pkg) return null;
  const spec = AGREEMENT_SPEC[pkg.id];
  return (
    <div className="pcw-modal-overlay" role="dialog" aria-modal="true" aria-label={`${pkg.name} Package Agreement`}>
      <div className="pcw-modal">
        <div className="pcw-modal__header">
          <div className="pcw-modal__header-text">
            <p className="pcw-modal__company">AGARA INFRA — Construction Rate Card</p>
            <h2 className="pcw-modal__title">{pkg.name} Package — ₹{pkg.rate.toLocaleString("en-IN")}/- per Sq.ft</h2>
            <p className="pcw-modal__note">For reference purpose only. Not a final quotation.</p>
          </div>
          <button type="button" onClick={onClose} className="pcw-modal__close" aria-label="Close">
            <X className="pcw-modal__close-icon" />
          </button>
        </div>

        <div className="pcw-modal__body">
          {spec.sections.map((section) => (
            <div key={section.title} className="pcw-modal__section">
              <h3 className="pcw-modal__section-title">{section.title}</h3>
              <table className="pcw-modal__table">
                <thead>
                  <tr>
                    <th className="pcw-modal__th">Item</th>
                    <th className="pcw-modal__th">{pkg.name} Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((row) => (
                    <tr key={row.item} className="pcw-modal__tr">
                      <td className="pcw-modal__td pcw-modal__td--item">{row.item}</td>
                      <td className="pcw-modal__td">{row.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="pcw-modal__section">
            <h3 className="pcw-modal__section-title">Payment Milestones</h3>
            <div className="pcw-modal__milestones">
              {PAYMENT_MILESTONES.map((m) => (
                <div key={m.id} className="pcw-modal__milestone">
                  <span className="pcw-modal__milestone-label">{m.label}</span>
                  <span className="pcw-modal__milestone-pct">{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pcw-modal__footer-note">
            <p>• Detail quotation will be given after finalizing floor plans and elevation.</p>
            <p>• Additional charges may be added after finalizing floor plans.</p>
            <p>• THIS SHOULD BE KEPT CONFIDENTIAL AND NOT FORWARDED TO A THIRD PERSON.</p>
          </div>
        </div>

        <div className="pcw-modal__actions">
          <Button variant="outline" onClick={onClose} className="pcw-modal__btn">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main wizard component ────────────────────────────────────────────────────
export function ProjectCreationWizard() {
  const navigate = useNavigate();

  // ── Step routing ──────────────────────────────────────────────────────
  const [step, setStep] = useState(0);

  // ── Step 1 state ──────────────────────────────────────────────────────
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [projectType, setProjectType] = useState("residential");
  const [siteAddress, setSiteAddress] = useState("");
  const [description, setDescription] = useState("");

  // ── Step 2 state ──────────────────────────────────────────────────────
  const [selectedServices, setSelectedServices] = useState([]);

  // ── Step 3 state (Construction Agreement) ─────────────────────────────
  const [selectedPackage, setSelectedPackage] = useState(null);   // "basic"|"standard"|"premium"
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [agreementNumber, setAgreementNumber] = useState("");
  const [agreementDate, setAgreementDate] = useState("");
  const [agreementFile, setAgreementFile] = useState(null);
  const [useTemplate, setUseTemplate] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [modalPkg, setModalPkg] = useState(null);  // package object to show in modal

  // ── Step 4 state (Review) ─────────────────────────────────────────────
  const [confirmReview, setConfirmReview] = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────
  const hasConstruction = selectedServices.includes("construction");
  const STEPS = hasConstruction ? CONSTRUCTION_STEPS : BASE_STEPS;
  const isLastStep = step === STEPS.length - 1;

  const selectedPkgObj = PACKAGES.find((p) => p.id === selectedPackage) ?? null;
  const approxCost = selectedPkgObj && builtUpArea
    ? (selectedPkgObj.rate * Number(builtUpArea)).toLocaleString("en-IN")
    : null;
  const workflowItems = buildWorkflowPreview(selectedServices);
  const selectedLabels = SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => s.name);

  // ── Validation ────────────────────────────────────────────────────────
  const isStep1Valid = () =>
    projectName.trim() !== "" && clientName.trim() !== "" &&
    phoneNumber.trim() !== "" && projectType !== "" && siteAddress.trim() !== "";

  const isStep2Valid = () => selectedServices.length > 0;

  const isStep3Valid = () =>
    selectedPackage !== null && (useTemplate || agreementFile !== null);

  const isCurrentStepValid = () => {
    if (step === 0) return isStep1Valid();
    if (step === 1) return isStep2Valid();
    if (step === 2 && hasConstruction) return isStep3Valid();
    // Review step: needs checkbox
    if (isLastStep) return confirmReview;
    return true;
  };

  // ── Handlers ──────────────────────────────────────────────────────────
  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrevious = () => setStep((s) => Math.max(s - 1, 0));

  const handleSaveDraft = () => {
    // Placeholder: future persistence
    console.log("Draft saved", { projectName, clientName, selectedPackage });
  };

  const handleCreateProject = () => {
    if (!confirmReview) return;
    // Placeholder: wire to createProject service when Review step is complete
    console.log("Creating project…", { projectName, clientName, selectedPackage });
    navigate("/app/projects");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setAgreementFile(file);
    if (file) setUseTemplate(false);
  };

  const handleUseTemplate = () => {
    setUseTemplate((v) => !v);
    if (!useTemplate) setAgreementFile(null);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="project-creation-wizard">

      {/* Back link */}
      <Link to="/app/projects" className="project-creation-wizard__back-link">
        <ArrowLeft className="project-creation-wizard__back-icon" />
        Back to Projects
      </Link>

      {/* Page header — changes per step */}
      <div className="project-creation-wizard__header">
        <h1 className="project-creation-wizard__title">
          {step === 0 && "Create New Project"}
          {step === 1 && "Select Project Services"}
          {step === 2 && hasConstruction && "Construction Agreement"}
          {(step === 2 && !hasConstruction) || step === 3 ? "Review Project" : null}
        </h1>
        <p className="project-creation-wizard__subtitle">
          {step === 0 && "Enter the basic information to create a new project."}
          {step === 1 && "Choose one or more services that will be provided for this project. The selected services will automatically create the corresponding project workflow and modules."}
          {step === 2 && hasConstruction && "Select a construction package and upload or use the company agreement template."}
          {((step === 2 && !hasConstruction) || step === 3) && "Review the entered information before creating the project. You can go back and edit any section if needed."}
        </p>
      </div>

      {/* Step indicators */}
      <div className="project-creation-wizard__steps">
        {STEPS.map((label, i) => (
          <Badge
            key={label}
            variant={step === i ? "default" : step > i ? "secondary" : "outline"}
            className="project-creation-wizard__step-badge"
          >
            {i + 1}. {label}
          </Badge>
        ))}
      </div>

      {/* ── STEP 1 — Basic Information ──────────────────────────────────── */}
      {step === 0 && (
        <Card className="project-creation-wizard__card">
          <CardHeader>
            <CardTitle>Basic Project Information</CardTitle>
          </CardHeader>
          <CardContent className="project-creation-wizard__form">
            <div className="project-creation-wizard__form-row">
              <div className="project-creation-wizard__field">
                <Label htmlFor="projectName" className="project-creation-wizard__label">
                  Project Name<span className="project-creation-wizard__required">*</span>
                </Label>
                <Input
                  id="projectName" type="text" value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="project-creation-wizard__input"
                />
              </div>
              <div className="project-creation-wizard__field">
                <Label htmlFor="clientName" className="project-creation-wizard__label">
                  Client Name<span className="project-creation-wizard__required">*</span>
                </Label>
                <Input
                  id="clientName" type="text" value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="project-creation-wizard__input"
                />
              </div>
            </div>

            <div className="project-creation-wizard__form-row">
              <div className="project-creation-wizard__field">
                <Label htmlFor="phoneNumber" className="project-creation-wizard__label">
                  Phone Number<span className="project-creation-wizard__required">*</span>
                </Label>
                <Input
                  id="phoneNumber" type="tel" value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="project-creation-wizard__input"
                />
              </div>
              <div className="project-creation-wizard__field">
                <Label htmlFor="projectType" className="project-creation-wizard__label">
                  Project Type<span className="project-creation-wizard__required">*</span>
                </Label>
                <Select
                  id="projectType" value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="project-creation-wizard__select"
                >
                  {PROJECT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="project-creation-wizard__field project-creation-wizard__field--full">
              <Label htmlFor="siteAddress" className="project-creation-wizard__label">
                Site Address<span className="project-creation-wizard__required">*</span>
              </Label>
              <Input
                id="siteAddress" type="text" value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="Enter complete site address"
                className="project-creation-wizard__input"
              />
            </div>

            <div className="project-creation-wizard__field project-creation-wizard__field--full">
              <Label htmlFor="description" className="project-creation-wizard__label">
                Description<span className="project-creation-wizard__optional">(Optional)</span>
              </Label>
              <Textarea
                id="description" value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..." rows={4}
                className="project-creation-wizard__textarea"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 2 — Select Services ────────────────────────────────────── */}
      {step === 1 && (
        <div className="project-creation-wizard__services-section">
          <div className="project-creation-wizard__services-grid">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedServices.includes(service.id);
              return (
                <button
                  key={service.id} type="button"
                  onClick={() => toggleService(service.id)}
                  aria-pressed={isSelected}
                  className={cx("project-creation-wizard__service-card", isSelected && "project-creation-wizard__service-card--selected")}
                >
                  <span className={cx("project-creation-wizard__service-check", isSelected && "project-creation-wizard__service-check--visible")} aria-hidden="true">
                    <Check className="project-creation-wizard__service-check-icon" />
                  </span>
                  <span className={cx("project-creation-wizard__service-icon-wrap", isSelected && "project-creation-wizard__service-icon-wrap--selected")} aria-hidden="true">
                    <Icon className="project-creation-wizard__service-icon" />
                  </span>
                  <p className="project-creation-wizard__service-name">{service.name}</p>
                  <p className="project-creation-wizard__service-desc">{service.description}</p>
                </button>
              );
            })}
          </div>

          {selectedServices.length > 0 && (
            <div className="project-creation-wizard__selected-summary">
              <p className="project-creation-wizard__selected-label">
                Selected Services
                <span className="project-creation-wizard__selected-count">{selectedServices.length}</span>
              </p>
              <p className="project-creation-wizard__selected-list">{selectedLabels.join(" • ")}</p>
            </div>
          )}

          {workflowItems.length > 0 && (
            <div className="project-creation-wizard__workflow">
              <h3 className="project-creation-wizard__workflow-title">Selected Workflow</h3>
              <div className="project-creation-wizard__workflow-tracks">
                {workflowItems.map((track) => (
                  <div key={track.serviceId} className="project-creation-wizard__workflow-track">
                    <p className="project-creation-wizard__workflow-service">{track.label}</p>
                    <div className="project-creation-wizard__workflow-steps">
                      {track.steps.map((wStep, idx) => (
                        <div key={wStep} className="project-creation-wizard__workflow-step">
                          <span className="project-creation-wizard__workflow-node">{wStep}</span>
                          {idx < track.steps.length - 1 && (
                            <span className="project-creation-wizard__workflow-arrow">↓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3 — Construction Agreement (only when construction selected) ── */}
      {step === 2 && hasConstruction && (
        <div className="project-creation-wizard__agreement-section">

          {/* Package selection */}
          <div className="project-creation-wizard__pkg-header">
            <h2 className="project-creation-wizard__pkg-heading">Select Construction Package</h2>
            <p className="project-creation-wizard__pkg-subheading">
              Choose the package that matches your client's requirements and budget.
            </p>
          </div>

          <div className="project-creation-wizard__pkg-grid">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <button
                  key={pkg.id} type="button"
                  onClick={() => setSelectedPackage(pkg.id)}
                  aria-pressed={isSelected}
                  className={cx(
                    "project-creation-wizard__pkg-card",
                    `project-creation-wizard__pkg-card--${pkg.color}`,
                    isSelected && "project-creation-wizard__pkg-card--selected"
                  )}
                >
                  {pkg.badge && (
                    <span className="project-creation-wizard__pkg-badge">{pkg.badge}</span>
                  )}
                  <span className={cx("project-creation-wizard__pkg-check", isSelected && "project-creation-wizard__pkg-check--visible")} aria-hidden="true">
                    <Check className="project-creation-wizard__pkg-check-icon" />
                  </span>

                  <p className="project-creation-wizard__pkg-name">{pkg.name}</p>
                  <p className="project-creation-wizard__pkg-rate">
                    ₹{pkg.rate.toLocaleString("en-IN")}
                    <span className="project-creation-wizard__pkg-unit">/- per Sq.ft</span>
                  </p>
                  <p className="project-creation-wizard__pkg-tagline">{pkg.tagline}</p>

                  <ul className="project-creation-wizard__pkg-highlights">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="project-creation-wizard__pkg-highlight-item">
                        <ChevronRight className="project-creation-wizard__pkg-highlight-icon" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="project-creation-wizard__pkg-view-btn"
                    onClick={(e) => { e.stopPropagation(); setModalPkg(pkg); }}
                  >
                    <Eye className="project-creation-wizard__pkg-view-icon" />
                    View Full Agreement
                  </button>
                </button>
              );
            })}
          </div>

          {/* Agreement details form */}
          <Card className="project-creation-wizard__card">
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="project-creation-wizard__form">

              {/* Row 1: package, rate, area */}
              <div className="project-creation-wizard__form-row project-creation-wizard__form-row--3">
                <div className="project-creation-wizard__field">
                  <Label className="project-creation-wizard__label">Selected Package</Label>
                  <div className="project-creation-wizard__readonly-field">
                    {selectedPkgObj ? selectedPkgObj.name : <span className="project-creation-wizard__readonly-placeholder">None selected</span>}
                  </div>
                </div>
                <div className="project-creation-wizard__field">
                  <Label className="project-creation-wizard__label">Rate per Sq.ft</Label>
                  <div className="project-creation-wizard__readonly-field">
                    {selectedPkgObj ? `₹${selectedPkgObj.rate.toLocaleString("en-IN")}/-` : <span className="project-creation-wizard__readonly-placeholder">—</span>}
                  </div>
                </div>
                <div className="project-creation-wizard__field">
                  <Label htmlFor="builtUpArea" className="project-creation-wizard__label">
                    Approx. Built-up Area (Sq.ft)
                  </Label>
                  <Input
                    id="builtUpArea" type="number" min={0} value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                    placeholder="e.g. 1200"
                    className="project-creation-wizard__input"
                  />
                </div>
              </div>

              {/* Approx cost banner */}
              {approxCost && (
                <div className="project-creation-wizard__cost-banner">
                  <span className="project-creation-wizard__cost-label">Approximate Project Cost</span>
                  <span className="project-creation-wizard__cost-value">₹{approxCost}/-</span>
                  <span className="project-creation-wizard__cost-note">Indicative only — final quotation after floor plan finalisation</span>
                </div>
              )}

              {/* Row 2: agreement number, date */}
              <div className="project-creation-wizard__form-row">
                <div className="project-creation-wizard__field">
                  <Label htmlFor="agreementNumber" className="project-creation-wizard__label">Agreement Number</Label>
                  <Input
                    id="agreementNumber" type="text" value={agreementNumber}
                    onChange={(e) => setAgreementNumber(e.target.value)}
                    placeholder="e.g. AGR-2024-001"
                    className="project-creation-wizard__input"
                  />
                </div>
                <div className="project-creation-wizard__field">
                  <Label htmlFor="agreementDate" className="project-creation-wizard__label">Agreement Date</Label>
                  <Input
                    id="agreementDate" type="date" value={agreementDate}
                    onChange={(e) => setAgreementDate(e.target.value)}
                    className="project-creation-wizard__input"
                  />
                </div>
              </div>

              {/* Agreement document */}
              <div className="project-creation-wizard__field project-creation-wizard__field--full">
                <Label className="project-creation-wizard__label">
                  Agreement Document<span className="project-creation-wizard__required">*</span>
                </Label>
                <div className="project-creation-wizard__agreement-options">
                  <button
                    type="button"
                    onClick={handleUseTemplate}
                    className={cx("project-creation-wizard__template-btn", useTemplate && "project-creation-wizard__template-btn--active")}
                  >
                    <FileText className="project-creation-wizard__template-icon" />
                    <span>
                      <strong>Use Company Template</strong>
                      <small>Apply Agara Infra standard agreement for {selectedPkgObj?.name ?? "selected"} package</small>
                    </span>
                    {useTemplate && <Check className="project-creation-wizard__template-check" />}
                  </button>

                  <div className="project-creation-wizard__agreement-divider">
                    <span>or</span>
                  </div>

                  <label className={cx("project-creation-wizard__upload-btn", agreementFile && "project-creation-wizard__upload-btn--has-file")}>
                    <Upload className="project-creation-wizard__upload-icon" />
                    <span>
                      {agreementFile
                        ? <><strong>{agreementFile.name}</strong><small>Click to replace</small></>
                        : <><strong>Upload Agreement PDF</strong><small>PDF, DOC up to 10MB</small></>
                      }
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="project-creation-wizard__file-input" />
                  </label>
                </div>
              </div>

              {/* Row 3: advance, remarks */}
              <div className="project-creation-wizard__form-row">
                <div className="project-creation-wizard__field">
                  <Label htmlFor="advanceAmount" className="project-creation-wizard__label">
                    Advance Amount (₹)<span className="project-creation-wizard__optional">(Optional)</span>
                  </Label>
                  <Input
                    id="advanceAmount" type="number" min={0} value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    placeholder="e.g. 250000"
                    className="project-creation-wizard__input"
                  />
                </div>
                <div className="project-creation-wizard__field">
                  <Label htmlFor="remarks" className="project-creation-wizard__label">
                    Remarks<span className="project-creation-wizard__optional">(Optional)</span>
                  </Label>
                  <Input
                    id="remarks" type="text" value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any additional notes..."
                    className="project-creation-wizard__input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── STEP 3 (no construction) / STEP 4 — Review ─────────────────── */}
      {((step === 2 && !hasConstruction) || step === 3) && (
        <div className="pcw-review">

          {/* ── Section 1: Basic Info ────────────────────────────────── */}
          <div className="pcw-review__section">
            <div className="pcw-review__section-header">
              <div className="pcw-review__section-title-row">
                <span className="pcw-review__section-icon-wrap">
                  <User className="pcw-review__section-icon" />
                </span>
                <h2 className="pcw-review__section-title">Basic Project Information</h2>
              </div>
              <button type="button" className="pcw-review__edit-btn" onClick={() => setStep(0)}>
                <Pencil className="pcw-review__edit-icon" /> Edit
              </button>
            </div>
            <div className="pcw-review__info-grid">
              <div className="pcw-review__info-item">
                <span className="pcw-review__info-label">
                  <Tag className="pcw-review__info-label-icon" /> Project Name
                </span>
                <span className="pcw-review__info-value">{projectName || "—"}</span>
              </div>
              <div className="pcw-review__info-item">
                <span className="pcw-review__info-label">
                  <User className="pcw-review__info-label-icon" /> Client Name
                </span>
                <span className="pcw-review__info-value">{clientName || "—"}</span>
              </div>
              <div className="pcw-review__info-item">
                <span className="pcw-review__info-label">
                  <Phone className="pcw-review__info-label-icon" /> Phone Number
                </span>
                <span className="pcw-review__info-value">{phoneNumber || "—"}</span>
              </div>
              <div className="pcw-review__info-item">
                <span className="pcw-review__info-label">
                  <Building2 className="pcw-review__info-label-icon" /> Project Type
                </span>
                <span className="pcw-review__info-value pcw-review__info-value--badge">
                  {PROJECT_TYPE_OPTIONS.find((o) => o.value === projectType)?.label ?? projectType}
                </span>
              </div>
              <div className="pcw-review__info-item pcw-review__info-item--full">
                <span className="pcw-review__info-label">
                  <MapPin className="pcw-review__info-label-icon" /> Site Address
                </span>
                <span className="pcw-review__info-value">{siteAddress || "—"}</span>
              </div>
              {description && (
                <div className="pcw-review__info-item pcw-review__info-item--full">
                  <span className="pcw-review__info-label">
                    <AlignLeft className="pcw-review__info-label-icon" /> Description
                  </span>
                  <span className="pcw-review__info-value pcw-review__info-value--muted">{description}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 2: Selected Services ─────────────────────────── */}
          <div className="pcw-review__section">
            <div className="pcw-review__section-header">
              <div className="pcw-review__section-title-row">
                <span className="pcw-review__section-icon-wrap">
                  <ChevronRight className="pcw-review__section-icon" />
                </span>
                <h2 className="pcw-review__section-title">Selected Services</h2>
              </div>
              <button type="button" className="pcw-review__edit-btn" onClick={() => setStep(1)}>
                <Pencil className="pcw-review__edit-icon" /> Edit
              </button>
            </div>
            <div className="pcw-review__chips">
              {SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => {
                const Icon = s.icon;
                return (
                  <span key={s.id} className="pcw-review__chip">
                    <Icon className="pcw-review__chip-icon" />
                    {s.name}
                    <Check className="pcw-review__chip-check" />
                  </span>
                );
              })}
            </div>
          </div>

          {/* ── Section 3: Service Configuration ─────────────────────── */}
          {(hasConstruction || selectedServices.includes("interior_design") || selectedServices.includes("turnkey")) && (
            <div className="pcw-review__section">
              <div className="pcw-review__section-header">
                <div className="pcw-review__section-title-row">
                  <span className="pcw-review__section-icon-wrap">
                    <FileText className="pcw-review__section-icon" />
                  </span>
                  <h2 className="pcw-review__section-title">Service Configuration</h2>
                </div>
                {hasConstruction && (
                  <button type="button" className="pcw-review__edit-btn" onClick={() => setStep(2)}>
                    <Pencil className="pcw-review__edit-icon" /> Edit
                  </button>
                )}
              </div>

              {/* Construction config */}
              {hasConstruction && selectedPkgObj && (
                <div className="pcw-review__config-block">
                  <div className="pcw-review__config-header">
                    <Building2 className="pcw-review__config-icon" />
                    <span className="pcw-review__config-service">Construction</span>
                  </div>
                  <div className="pcw-review__config-grid">
                    <div className="pcw-review__config-item">
                      <span className="pcw-review__config-label">Selected Package</span>
                      <span className={cx("pcw-review__config-value", "pcw-review__config-value--pkg", `pcw-review__config-value--${selectedPkgObj.color}`)}>
                        {selectedPkgObj.name}
                      </span>
                    </div>
                    <div className="pcw-review__config-item">
                      <span className="pcw-review__config-label">Rate</span>
                      <span className="pcw-review__config-value">₹{selectedPkgObj.rate.toLocaleString("en-IN")} / Sq.ft</span>
                    </div>
                    {builtUpArea && (
                      <div className="pcw-review__config-item">
                        <span className="pcw-review__config-label">Estimated Built-up Area</span>
                        <span className="pcw-review__config-value">{Number(builtUpArea).toLocaleString("en-IN")} Sq.ft</span>
                      </div>
                    )}
                    {approxCost && (
                      <div className="pcw-review__config-item">
                        <span className="pcw-review__config-label">Estimated Construction Cost</span>
                        <span className="pcw-review__config-value pcw-review__config-value--highlight">₹{approxCost}/-</span>
                      </div>
                    )}
                    {agreementNumber && (
                      <div className="pcw-review__config-item">
                        <span className="pcw-review__config-label">Agreement Number</span>
                        <span className="pcw-review__config-value">{agreementNumber}</span>
                      </div>
                    )}
                    {agreementDate && (
                      <div className="pcw-review__config-item">
                        <span className="pcw-review__config-label">Agreement Date</span>
                        <span className="pcw-review__config-value">{agreementDate}</span>
                      </div>
                    )}
                    <div className="pcw-review__config-item">
                      <span className="pcw-review__config-label">Agreement Document</span>
                      <span className="pcw-review__config-value pcw-review__config-value--doc">
                        {agreementFile
                          ? <><FileText className="pcw-review__doc-icon" />{agreementFile.name}</>
                          : useTemplate
                            ? <><FileText className="pcw-review__doc-icon" />Company Template — {selectedPkgObj.name} Package</>
                            : <span className="pcw-review__config-value--missing">Not attached</span>
                        }
                      </span>
                    </div>
                    {advanceAmount && (
                      <div className="pcw-review__config-item">
                        <span className="pcw-review__config-label">Advance Amount</span>
                        <span className="pcw-review__config-value">₹{Number(advanceAmount).toLocaleString("en-IN")}/-</span>
                      </div>
                    )}
                    {remarks && (
                      <div className="pcw-review__config-item pcw-review__config-item--full">
                        <span className="pcw-review__config-label">Remarks</span>
                        <span className="pcw-review__config-value pcw-review__config-value--muted">{remarks}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Turnkey config (no construction) */}
              {selectedServices.includes("turnkey") && !hasConstruction && (
                <div className="pcw-review__config-block">
                  <div className="pcw-review__config-header">
                    <Key className="pcw-review__config-icon" />
                    <span className="pcw-review__config-service">Turnkey Project</span>
                  </div>
                  <p className="pcw-review__config-note">
                    End-to-end project delivery — workflow modules will be available after project creation.
                  </p>
                </div>
              )}

              {/* Interior Design config */}
              {selectedServices.includes("interior_design") && (
                <div className="pcw-review__config-block">
                  <div className="pcw-review__config-header">
                    <Sofa className="pcw-review__config-icon" />
                    <span className="pcw-review__config-service">Interior Design & Execution</span>
                  </div>
                  <p className="pcw-review__config-note">
                    Interior scope will be defined in the Requirements module after project creation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Confirmation checkbox ─────────────────────────────────── */}
          <div className="pcw-review__confirm-block">
            <label className={cx("pcw-review__confirm-label", confirmReview && "pcw-review__confirm-label--checked")}>
              <span className={cx("pcw-review__confirm-box", confirmReview && "pcw-review__confirm-box--checked")} aria-hidden="true">
                {confirmReview && <Check className="pcw-review__confirm-check" />}
              </span>
              <input
                type="checkbox"
                checked={confirmReview}
                onChange={(e) => setConfirmReview(e.target.checked)}
                className="pcw-review__confirm-input"
              />
              <span className="pcw-review__confirm-text">
                I have reviewed all the entered information and confirm it is correct.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ── Agreement Modal ──────────────────────────────────────────────── */}
      {modalPkg && <AgreementModal pkg={modalPkg} onClose={() => setModalPkg(null)} />}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="project-creation-wizard__nav">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 0}
          className="project-creation-wizard__nav-btn"
        >
          <ArrowLeft className="project-creation-wizard__nav-icon" />
          Previous
        </Button>

        <div className="project-creation-wizard__nav-right">
          {(step === 2 && hasConstruction || isLastStep) && (
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="project-creation-wizard__nav-btn"
            >
              <Save className="project-creation-wizard__nav-icon" />
              Save Draft
            </Button>
          )}

          <Button
            onClick={isLastStep ? handleCreateProject : handleNext}
            disabled={!isCurrentStepValid()}
            className="project-creation-wizard__nav-btn"
          >
            {isLastStep ? "Create Project" : "Continue"}
            <ArrowRight className="project-creation-wizard__nav-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
