"use client";
import {
  PublishButton,
  UnpublishButton,
  useAuth,
  useDocumentInfo,
} from "@payloadcms/ui";
import { isEditor } from "../roles";
export function PublishControl() {
  const { user } = useAuth();
  const { data } = useDocumentInfo();
  if (!isEditor(user)) return null;
  return data?.reviewStatus === "approved" ? (
    <PublishButton label="Publish" />
  ) : (
    <span className="workflow-hint">
      Save an approved review before publishing.
    </span>
  );
}
export function UnpublishControl() {
  const { user } = useAuth();
  return isEditor(user) ? <UnpublishButton /> : null;
}
