"use client";
import {
  CONSTRUCTION_TYPE_OPTIONS,
  FOUNDATION_TYPE_OPTIONS,
  STRUCTURAL_SYSTEM_OPTIONS,
  CONSTRUCTION_METHOD_OPTIONS,
  MACHINERY_OPTIONS,
  APPROVAL_OPTIONS,
  SAFETY_COMPLIANCE_OPTIONS,
} from "@/lib/constants/onboarding";
import { FormField } from "@/components/molecules/form-field";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { HardHat, Plus, Trash2 } from "lucide-react";
import "@/assets/styles/components/ConstructionDetailsForm.scss";

export const EMPTY_CONSTRUCTION_DETAILS = {
  constructionType: "villa",
  foundationType: "raft",
  structuralSystem: "rcc_frame",
  numberOfFloors: 2,
  plotArea: 0,
  builtUpArea: 0,
  contractor: { name: "", contact: "", company: "", license: "" },
  estimatedConstructionBudget: 0,
  materialBudget: 0,
  labourBudget: 0,
  constructionMethod: "conventional",
  siteMobilizationDate: "",
  requiredMachinery: [],
  requiredApprovals: [],
  safetyCompliance: [],
  milestones: [{ title: "Site Mobilization", targetDate: "" }],
};

function CheckboxGroup({ options, selected, onChange }) {
  const toggle = (item) => {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    );
  };

  return (
    <div className="construction-details-form__checkbox-grid">
      {options.map((option) => (
        <label
          key={option}
          className={`construction-details-form__checkbox-label${
            selected.includes(option)
              ? " construction-details-form__checkbox-label--checked"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="construction-details-form__checkbox"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export function ConstructionDetailsForm({ value, onChange }) {
  const update = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  const updateContractor = (key, val) => {
    onChange({ ...value, contractor: { ...value.contractor, [key]: val } });
  };

  const updateMilestone = (index, field, val) => {
    const milestones = [...value.milestones];
    milestones[index] = { ...milestones[index], [field]: val };
    onChange({ ...value, milestones });
  };

  const addMilestone = () => {
    onChange({
      ...value,
      milestones: [...value.milestones, { title: "", targetDate: "" }],
    });
  };

  const removeMilestone = (index) => {
    onChange({
      ...value,
      milestones: value.milestones.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="construction-details-form">
      <div className="construction-details-form__banner">
        <HardHat className="construction-details-form__banner-icon" />
        <div>
          <p className="construction-details-form__banner-title">
            Construction Details
          </p>
          <p className="construction-details-form__banner-text">
            This information will populate BOQ, procurement, and site execution
            modules.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Project Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="construction-details-form__grid construction-details-form__grid--3">
          <FormField label="Construction Type" required>
            <Select
              value={value.constructionType}
              onChange={(e) => update("constructionType", e.target.value)}
            >
              {CONSTRUCTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Foundation Type" required>
            <Select
              value={value.foundationType}
              onChange={(e) => update("foundationType", e.target.value)}
            >
              {FOUNDATION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Structural System" required>
            <Select
              value={value.structuralSystem}
              onChange={(e) => update("structuralSystem", e.target.value)}
            >
              {STRUCTURAL_SYSTEM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Construction Method" required>
            <Select
              value={value.constructionMethod}
              onChange={(e) => update("constructionMethod", e.target.value)}
            >
              {CONSTRUCTION_METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Number of Floors" required>
            <Input
              type="number"
              min={1}
              value={value.numberOfFloors || ""}
              onChange={(e) =>
                update("numberOfFloors", parseInt(e.target.value) || 0)
              }
            />
          </FormField>
          <FormField label="Site Mobilization Date" required>
            <Input
              type="date"
              value={value.siteMobilizationDate}
              onChange={(e) => update("siteMobilizationDate", e.target.value)}
            />
          </FormField>
          <FormField label="Plot Area (sqft)" required>
            <Input
              type="number"
              min={0}
              value={value.plotArea || ""}
              onChange={(e) => update("plotArea", parseInt(e.target.value) || 0)}
            />
          </FormField>
          <FormField label="Built-up Area (sqft)" required>
            <Input
              type="number"
              min={0}
              value={value.builtUpArea || ""}
              onChange={(e) =>
                update("builtUpArea", parseInt(e.target.value) || 0)
              }
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="construction-details-form__grid construction-details-form__grid--3">
          <FormField label="Estimated Construction Budget (₹)" required>
            <Input
              type="number"
              min={0}
              value={value.estimatedConstructionBudget || ""}
              onChange={(e) =>
                update(
                  "estimatedConstructionBudget",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </FormField>
          <FormField label="Material Budget (₹)" required>
            <Input
              type="number"
              min={0}
              value={value.materialBudget || ""}
              onChange={(e) =>
                update("materialBudget", parseInt(e.target.value) || 0)
              }
            />
          </FormField>
          <FormField label="Labour Budget (₹)" required>
            <Input
              type="number"
              min={0}
              value={value.labourBudget || ""}
              onChange={(e) =>
                update("labourBudget", parseInt(e.target.value) || 0)
              }
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Contractor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="construction-details-form__grid construction-details-form__grid--2">
          <FormField label="Contractor Name" required>
            <Input
              value={value.contractor.name}
              onChange={(e) => updateContractor("name", e.target.value)}
              placeholder="Vikram Patil"
            />
          </FormField>
          <FormField label="Company" required>
            <Input
              value={value.contractor.company}
              onChange={(e) => updateContractor("company", e.target.value)}
              placeholder="Patil Constructions Pvt Ltd"
            />
          </FormField>
          <FormField label="Contact Number" required>
            <Input
              value={value.contractor.contact}
              onChange={(e) => updateContractor("contact", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </FormField>
          <FormField label="License Number">
            <Input
              value={value.contractor.license || ""}
              onChange={(e) => updateContractor("license", e.target.value)}
              placeholder="MH-CON-2019-4521"
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Required Machinery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxGroup
            options={MACHINERY_OPTIONS}
            selected={value.requiredMachinery}
            onChange={(v) => update("requiredMachinery", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Required Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxGroup
            options={APPROVAL_OPTIONS}
            selected={value.requiredApprovals}
            onChange={(v) => update("requiredApprovals", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="construction-details-form__card-title">
            Safety Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxGroup
            options={SAFETY_COMPLIANCE_OPTIONS}
            selected={value.safetyCompliance}
            onChange={(v) => update("safetyCompliance", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="construction-details-form__milestones-header">
          <CardTitle className="construction-details-form__card-title">
            Construction Milestones
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="construction-details-form__add-btn"
            onClick={addMilestone}
          >
            <Plus className="construction-details-form__add-icon" /> Add Milestone
          </Button>
        </CardHeader>
        <CardContent className="construction-details-form__milestones">
          {value.milestones.map((milestone, index) => (
            <div key={index} className="construction-details-form__milestone-row">
              <FormField
                label={index === 0 ? "Milestone" : undefined}
                className="construction-details-form__milestone-field"
              >
                <Input
                  value={milestone.title}
                  onChange={(e) =>
                    updateMilestone(index, "title", e.target.value)
                  }
                  placeholder="Foundation Complete"
                />
              </FormField>
              <div className="construction-details-form__milestone-date-wrap">
                <FormField
                  label={index === 0 ? "Target Date" : undefined}
                  className="construction-details-form__milestone-date"
                >
                  <Input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) =>
                      updateMilestone(index, "targetDate", e.target.value)
                    }
                  />
                </FormField>
                {value.milestones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="construction-details-form__remove-btn"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="construction-details-form__remove-icon" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
