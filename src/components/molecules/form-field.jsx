import { Label } from "@/components/common/Label";
import "@/assets/styles/components/FormField.scss";

export function FormField({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}) {
  const rootClassName = ["form-field", className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      {label && (
        <Label htmlFor={htmlFor} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </Label>
      )}
      {children}
      {hint && <p className="form-field__hint">{hint}</p>}
    </div>
  );
}
