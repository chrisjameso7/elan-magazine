"use client";
import { useAuth, useField } from "@payloadcms/ui";
import type { SelectFieldClientProps } from "payload";
import { isEditor } from "../roles";
const stages = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "Pending review" },
  { value: "changes_requested", label: "Changes requested" },
  { value: "approved", label: "Approved — ready to publish" },
];
export function ReviewField({ path, readOnly }: SelectFieldClientProps) {
  const { user } = useAuth();
  const { value, setValue, showError, errorMessage } = useField<string>({
    path,
  });
  const editor = isEditor(user);
  return (
    <div className="field-type workflow-field">
      <label htmlFor={`field-${path}`}>Editorial stage</label>
      <select
        id={`field-${path}`}
        value={value || "draft"}
        disabled={readOnly}
        onChange={(e) => setValue(e.target.value)}
      >
        {stages.map((s) => (
          <option
            key={s.value}
            value={s.value}
            disabled={!editor && !["draft", "in_review"].includes(s.value)}
          >
            {s.label}
          </option>
        ))}
      </select>
      <p>
        {editor
          ? "Save the draft, submit for review, then save an approval before publishing. Editing approved content requires another review."
          : "Save drafts here. Choose Pending review and Save draft to submit. Return to Draft to withdraw a submission or edit approved content."}
      </p>
      {showError && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
