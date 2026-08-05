"use client";
import { getAllClients } from "@/lib/store/client-store";
import { FormField } from "@/components/molecules/form-field";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import "@/assets/styles/components/ClientPicker.scss";

export function ClientPicker({
  mode,
  clientId,
  newClientName,
  onModeChange,
  onClientIdChange,
  onNewClientNameChange,
  className,
}) {
  const clients = getAllClients();
  const rootClassName = ["client-picker", className].filter(Boolean).join(" ");

  return (
    <FormField label="Client" required className={rootClassName}>
      <div className="client-picker__body">
        <div className="client-picker__mode-toggle">
          <button
            type="button"
            onClick={() => onModeChange("existing")}
            className={`client-picker__mode-btn${
              mode === "existing" ? " client-picker__mode-btn--active" : ""
            }`}
          >
            Select existing
          </button>
          <button
            type="button"
            onClick={() => onModeChange("new")}
            className={`client-picker__mode-btn${
              mode === "new" ? " client-picker__mode-btn--active" : ""
            }`}
          >
            Add new client
          </button>
        </div>

        {mode === "existing" ? (
          clients.length > 0 ? (
            <Select
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
            >
              <option value="">Choose a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company ? ` · ${c.company}` : ""}
                </option>
              ))}
            </Select>
          ) : (
            <p className="client-picker__empty">
              No clients yet. Switch to &quot;Add new client&quot; to enter a
              name.
            </p>
          )
        ) : (
          <Input
            value={newClientName}
            onChange={(e) => onNewClientNameChange(e.target.value)}
            placeholder="Client or company name"
            className="client-picker__input"
          />
        )}
      </div>
    </FormField>
  );
}

export function resolveClientDisplayName(mode, clientId, newClientName) {
  if (mode === "new") return newClientName.trim();
  const client = getAllClients().find((c) => c.id === clientId);
  return client?.name ?? "";
}
