"use client";
import { SERVICE_TYPE_OPTIONS } from "@/lib/constants/onboarding";
import { Check } from "lucide-react";
import "@/assets/styles/components/ServiceTypeSelector.scss";

export function ServiceTypeSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="service-type-selector">
      {SERVICE_TYPE_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.id);
        const Icon = option.icon;
        const isConstruction = option.id === "construction";

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
            className={`service-type-selector__option${
              isSelected ? " service-type-selector__option--selected" : ""
            }${isConstruction ? " service-type-selector__option--construction" : ""}`}
          >
            {isSelected && (
              <span
                className={`service-type-selector__check${
                  isConstruction
                    ? " service-type-selector__check--construction"
                    : ""
                }`}
              >
                <Check className="service-type-selector__check-icon" />
              </span>
            )}
            <div
              className={`service-type-selector__icon-wrap${
                isSelected
                  ? " service-type-selector__icon-wrap--selected"
                  : ""
              }${
                isConstruction
                  ? " service-type-selector__icon-wrap--construction"
                  : ""
              }`}
            >
              <Icon className="service-type-selector__option-icon" />
            </div>
            <div>
              <p className="service-type-selector__label">{option.label}</p>
              <p className="service-type-selector__description">
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
