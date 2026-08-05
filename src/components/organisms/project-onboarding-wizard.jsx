"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { createProject } from "@/services/projectsService";
import { ONBOARDING_STEPS, SERVICE_TYPE_LABELS } from "@/lib/constants/onboarding";
import { CURRENT_USER } from "@/lib/constants";
import { ServiceTypeSelector } from "@/components/molecules/service-type-selector";
import { ClientPicker, resolveClientDisplayName } from "@/components/molecules/client-picker";
import { ConstructionDetailsForm, EMPTY_CONSTRUCTION_DETAILS, } from "@/components/molecules/construction-details-form";
import { FormField } from "@/components/molecules/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { Badge } from "@/components/common/Badge";
import { cx, formatCurrency } from "@/lib/utils";
import "@/assets/styles/components/ProjectOnboardingWizard.scss";

const TEAM_OPTIONS = ["Adarsh P", "Priya Nair", "Amit Joshi", "Sneha Iyer"];

export function ProjectOnboardingWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [clientMode, setClientMode] = useState("existing");
    const [clientId, setClientId] = useState("");
    const [newClientName, setNewClientName] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("residential");
    const [serviceTypes, setServiceTypes] = useState([]);
    const [constructionDetails, setConstructionDetails] = useState(EMPTY_CONSTRUCTION_DETAILS);
    const [startDate, setStartDate] = useState("");
    const [expectedCompletion, setExpectedCompletion] = useState("");
    const [team, setTeam] = useState([CURRENT_USER.name]);
    const hasConstruction = serviceTypes.includes("construction");
    const visibleSteps = ONBOARDING_STEPS.filter((s) => s.id !== "construction" || hasConstruction);
    const currentStep = visibleSteps[step];
    const isLastStep = step === visibleSteps.length - 1;
    const toggleTeam = (member) => {
        setTeam((prev) => prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]);
    };
    const validateStep = () => {
        if (currentStep.id === "basics") {
            if (!name.trim() || !location.trim() || !city.trim()) {
                toast.error("Please fill in all required project basics");
                return false;
            }
            if (clientMode === "existing" && !clientId) {
                toast.error("Please select a client or add a new one");
                return false;
            }
            if (clientMode === "new" && !newClientName.trim()) {
                toast.error("Please enter the client name");
                return false;
            }
        }
        if (currentStep.id === "services") {
            if (serviceTypes.length === 0) {
                toast.error("Select at least one service type");
                return false;
            }
        }
        if (currentStep.id === "construction") {
            const cd = constructionDetails;
            if (!cd.siteMobilizationDate || !cd.contractor.name || !cd.contractor.company || cd.plotArea <= 0 || cd.builtUpArea <= 0 || cd.estimatedConstructionBudget <= 0) {
                toast.error("Please complete all required construction fields");
                return false;
            }
        }
        if (currentStep.id === "team") {
            if (!startDate || !expectedCompletion) {
                toast.error("Please set project timeline dates");
                return false;
            }
        }
        return true;
    };
    const next = () => {
        if (!validateStep())
            return;
        setStep((s) => Math.min(s + 1, visibleSteps.length - 1));
    };
    const back = () => setStep((s) => Math.max(s - 1, 0));
    const submit = async () => {
        if (!validateStep())
            return;
        setSubmitting(true);
        const payload = {
            name: name.trim(),
            ...(clientMode === "existing" ? { clientId } : { clientName: newClientName.trim() }),
            location: location.trim(),
            city: city.trim(),
            description: description.trim(),
            startDate,
            expectedCompletion,
            serviceTypes,
            constructionDetails: hasConstruction ? constructionDetails : undefined,
            team,
            type,
        };
        try {
            const project = createProject(payload);
            toast.success("Project created successfully", {
                description: hasConstruction
                    ? "Construction details synced to BOQ, timeline, and site modules."
                    : "Your project workspace is ready.",
            });
            navigate(`/app/projects/${project.id}`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<div className="project-onboarding-wizard">
      <div>
        <Link to="/app/projects" className="project-onboarding-wizard__back-link">
          <ArrowLeft className="project-onboarding-wizard__back-icon"/> Back to Projects
        </Link>
        <h1 className="project-onboarding-wizard__heading">New Project</h1>
        <p className="project-onboarding-wizard__subheading">Set up your project workspace in a few steps</p>
      </div>

      <div className="project-onboarding-wizard__steps">
        {visibleSteps.map((s, i) => (<div key={s.id} className="project-onboarding-wizard__step-group">
            <div className={cx("project-onboarding-wizard__step-indicator", i < step && "project-onboarding-wizard__step-indicator--complete", i === step && "project-onboarding-wizard__step-indicator--current", i > step && "project-onboarding-wizard__step-indicator--upcoming")}>
              {i < step ? <Check className="project-onboarding-wizard__step-check"/> : i + 1}
            </div>
            <span className={cx("project-onboarding-wizard__step-label", i === step ? "project-onboarding-wizard__step-label--current" : "project-onboarding-wizard__step-label--muted")}>
              {s.label}
            </span>
            {i < visibleSteps.length - 1 && <div className="project-onboarding-wizard__step-divider"/>}
          </div>))}
      </div>

      {currentStep.id === "basics" && (<Card>
          <CardHeader><CardTitle>Project Basics</CardTitle></CardHeader>
          <CardContent className="project-onboarding-wizard__basics-grid">
            <FormField label="Project Name" required className="project-onboarding-wizard__field-span-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lakeside Residence"/>
            </FormField>
            <ClientPicker mode={clientMode} clientId={clientId} newClientName={newClientName} onModeChange={setClientMode} onClientIdChange={setClientId} onNewClientNameChange={setNewClientName} className="project-onboarding-wizard__field-span-2"/>
            <FormField label="Project Category">
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="hospitality">Hospitality</option>
              </Select>
            </FormField>
            <FormField label="Location" required>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bandra West"/>
            </FormField>
            <FormField label="City" required>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai"/>
            </FormField>
            <FormField label="Description" className="project-onboarding-wizard__field-span-2">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief project description..." rows={3}/>
            </FormField>
          </CardContent>
        </Card>)}

      {currentStep.id === "services" && (<div className="project-onboarding-wizard__services">
          <div>
            <h2 className="project-onboarding-wizard__services-title">What services will this project include?</h2>
            <p className="project-onboarding-wizard__services-text">Select all that apply. Choosing Construction unlocks additional project-specific fields.</p>
          </div>
          <ServiceTypeSelector selected={serviceTypes} onChange={setServiceTypes}/>
        </div>)}

      {currentStep.id === "construction" && hasConstruction && (<ConstructionDetailsForm value={constructionDetails} onChange={setConstructionDetails}/>)}

      {currentStep.id === "team" && (<Card>
          <CardHeader><CardTitle>Team & Timeline</CardTitle></CardHeader>
          <CardContent className="project-onboarding-wizard__team-content">
            <div className="project-onboarding-wizard__team-grid">
              <FormField label="Start Date" required>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
              </FormField>
              <FormField label="Expected Completion" required>
                <Input type="date" value={expectedCompletion} onChange={(e) => setExpectedCompletion(e.target.value)}/>
              </FormField>
            </div>
            <FormField label="Assign Team Members">
              <div className="project-onboarding-wizard__team-list">
                {TEAM_OPTIONS.map((member) => (<button key={member} type="button" onClick={() => toggleTeam(member)} className={cx("project-onboarding-wizard__team-member", team.includes(member) && "project-onboarding-wizard__team-member--selected")}>
                    {member}
                  </button>))}
              </div>
            </FormField>
          </CardContent>
        </Card>)}

      {currentStep.id === "review" && (<Card>
          <CardHeader><CardTitle>Review & Create</CardTitle></CardHeader>
          <CardContent className="project-onboarding-wizard__review-content">
            <div className="project-onboarding-wizard__review-grid">
              <div><span className="project-onboarding-wizard__review-label">Project</span><p className="project-onboarding-wizard__review-value">{name}</p></div>
              <div><span className="project-onboarding-wizard__review-label">Client</span><p className="project-onboarding-wizard__review-value">{resolveClientDisplayName(clientMode, clientId, newClientName)}</p></div>
              <div><span className="project-onboarding-wizard__review-label">Location</span><p className="project-onboarding-wizard__review-value">{location}, {city}</p></div>
              <div><span className="project-onboarding-wizard__review-label">Timeline</span><p className="project-onboarding-wizard__review-value">{startDate} → {expectedCompletion}</p></div>
            </div>
            <div>
              <p className="project-onboarding-wizard__review-label">Services</p>
              <div className="project-onboarding-wizard__services-badges">
                {serviceTypes.map((s) => (<Badge key={s} variant={s === "construction" ? "secondary" : "default"}>
                    {SERVICE_TYPE_LABELS[s]}
                  </Badge>))}
              </div>
            </div>
            {hasConstruction && (<div className="project-onboarding-wizard__construction-summary">
                <p className="project-onboarding-wizard__construction-title">Construction Summary</p>
                <div className="project-onboarding-wizard__construction-grid">
                  <p><span className="project-onboarding-wizard__review-label">Type:</span> {constructionDetails.constructionType}</p>
                  <p><span className="project-onboarding-wizard__review-label">Floors:</span> {constructionDetails.numberOfFloors}</p>
                  <p><span className="project-onboarding-wizard__review-label">Built-up:</span> {constructionDetails.builtUpArea.toLocaleString()} sqft</p>
                  <p><span className="project-onboarding-wizard__review-label">Budget:</span> {formatCurrency(constructionDetails.estimatedConstructionBudget)}</p>
                  <p><span className="project-onboarding-wizard__review-label">Contractor:</span> {constructionDetails.contractor.company}</p>
                  <p><span className="project-onboarding-wizard__review-label">Method:</span> {constructionDetails.constructionMethod}</p>
                </div>
                <p className="project-onboarding-wizard__construction-note">
                  Will auto-create: {constructionDetails.milestones.length} timeline milestones, civil BOQ, and site kanban tasks.
                </p>
              </div>)}
          </CardContent>
        </Card>)}

      <div className="project-onboarding-wizard__nav">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          <ArrowLeft className="project-onboarding-wizard__nav-icon"/> Back
        </Button>
        {isLastStep ? (<Button onClick={submit} disabled={submitting}>
            {submitting ? <Loader2 className="project-onboarding-wizard__nav-icon project-onboarding-wizard__spin"/> : <Check className="project-onboarding-wizard__nav-icon"/>}
            Create Project
          </Button>) : (<Button onClick={next}>
            Continue <ArrowRight className="project-onboarding-wizard__nav-icon"/>
          </Button>)}
      </div>
    </div>);
}
