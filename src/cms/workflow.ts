import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
} from "payload";
import { isEditor, isStaff, isAdmin, isOwner } from "./access";
export const relationId = (value: unknown): number | string | undefined =>
  typeof value === "object" && value
    ? (value as { id?: number | string }).id
    : typeof value === "string" || typeof value === "number"
      ? value
      : undefined;
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (object.type === "upload")
      return { ...object, value: relationId(object.value) };
    return Object.fromEntries(
      Object.keys(object)
        .filter((k) => k !== "id")
        .sort()
        .map((k) => [k, stable(object[k])]),
    );
  }
  return value ?? null;
}
export function editorialFingerprint(doc: Record<string, unknown>): string {
  return JSON.stringify(
    stable({
      title: doc.title,
      slug: doc.slug,
      standfirst: doc.standfirst,
      section: relationId(doc.section),
      contributors: (Array.isArray(doc.contributors)
        ? doc.contributors
        : []
      ).map(relationId),
      hero: relationId(doc.hero),
      body: doc.body,
      sources: doc.sources,
      format: doc.format,
    }),
  );
}
export function mediaIds(value: unknown): Array<number | string> {
  const found = new Set<number | string>();
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const object = node as Record<string, unknown>;
    if (object.type === "upload" && object.relationTo === "media") {
      const id = relationId(object.value);
      if (id) found.add(id);
    }
    Object.values(object).forEach(walk);
  };
  walk(value);
  return [...found];
}
export const captureDraftIntent: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (operation === "create" || operation === "update")
    req.context.lumiereDraftWrite = "draft" in args && args.draft === true;
  return args;
};
export const accountOperation: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if (operation === "forgotPassword") {
    if (
      !("disableEmail" in args && args.disableEmail) &&
      !process.env.RESEND_API_KEY
    )
      throw new APIError(
        "Password recovery email is not configured. Ask the administrator for a private password setup link.",
        503,
      );
    const data = "data" in args ? (args.data as { email?: string }) : undefined;
    req.context.lumierePasswordResetEmail = data?.email?.trim().toLowerCase();
  }
  // Payload performs an internal update after generating its reset token. Capture
  // only that narrow write before Payload merges the existing account fields.
  if (
    operation === "update" &&
    !req.user &&
    req.context.lumierePasswordResetEmail &&
    "data" in args &&
    "id" in args
  ) {
    const data = args.data as Record<string, unknown>;
    if (
      typeof data.resetPasswordToken === "string" &&
      Object.keys(data).every((key) =>
        ["resetPasswordToken", "resetPasswordExpiration"].includes(key),
      )
    )
      req.context.lumierePasswordResetUserId = args.id;
  }
  return args;
};
export const userGuard: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (!req.user) {
    if (
      operation === "update" &&
      req.context.lumierePasswordResetEmail ===
        originalDoc?.email?.toLowerCase() &&
      String(req.context.lumierePasswordResetUserId) === String(originalDoc?.id)
    )
      return data;
    if (
      operation === "create" &&
      req.context.bootstrapOwner === true &&
      isOwner(data)
    ) {
      data.role = "administrator";
      return data;
    }
    throw new APIError("An administrator must provision this account.", 403);
  }
  if (
    !isAdmin(req.user) &&
    ((data.role !== undefined && data.role !== originalDoc?.role) ||
      (data.contributor !== undefined &&
        relationId(data.contributor) !==
          relationId(originalDoc?.contributor)) ||
      (data.email !== undefined && data.email !== originalDoc?.email))
  )
    throw new APIError(
      "Only administrators may change roles, linked contributors or account emails.",
      403,
    );
  if (originalDoc && isOwner(originalDoc)) data.role = "administrator";
  if (originalDoc && data.role && data.role !== originalDoc.role)
    data.sessions = [];
  if (
    originalDoc &&
    isOwner(originalDoc) &&
    data.email &&
    data.email !== originalDoc.email
  )
    throw new APIError(
      "Change the configured owner email before changing this account.",
      400,
    );
  return data;
};
export const articleWorkflow: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  const user = req.user;
  if (!isStaff(user))
    throw new APIError("A newsroom account is required.", 403);
  const original = (originalDoc || {}) as Record<string, unknown>;
  if (operation === "create") {
    data.createdBy = user!.id;
    if (!data.assignedTo) data.assignedTo = user!.id;
    if (!data.contributors && user?.contributor)
      data.contributors = [relationId(user.contributor)];
  } else if (
    data.createdBy !== undefined &&
    relationId(data.createdBy) !== relationId(original.createdBy)
  )
    throw new APIError("The original creator cannot be changed.", 403);
  data.updatedBy = user!.id;
  if (!isEditor(user)) {
    if (req.context.lumiereDraftWrite !== true)
      throw new APIError(
        "Writers must use Save draft or submit a draft for review.",
        403,
      );
    if (
      data._status === "published" ||
      data.reviewStatus === "approved" ||
      data.reviewStatus === "changes_requested"
    )
      throw new APIError(
        "Writers submit drafts for editorial approval; only editors publish.",
        403,
      );
    if (data._status !== "draft")
      throw new APIError("Save your changes as a draft.", 403);
    if (original.reviewStatus === "in_review" && data.reviewStatus !== "draft")
      throw new APIError(
        "Return the story to Draft before changing a submitted review.",
        400,
      );
  }
  const merged = { ...original, ...data };
  const changed =
    operation === "create" ||
    editorialFingerprint(merged) !== editorialFingerprint(original);
  let stage = String(data.reviewStatus || original.reviewStatus || "draft");
  if (
    stage === "approved" &&
    data.reviewStatus === "approved" &&
    original.reviewStatus !== "approved"
  ) {
    if (!isEditor(user) || original.reviewStatus !== "in_review")
      throw new APIError(
        "Submit a saved draft for review before approving it.",
        400,
      );
    if (changed)
      throw new APIError(
        "Save edited content and submit it for review before approval.",
        400,
      );
    data.approvedBy = user!.id;
    data.approvedAt = new Date().toISOString();
  }
  if (changed && stage === "approved") {
    if (data._status === "published")
      throw new APIError(
        "Content changed after approval. Save a draft and request another review.",
        400,
      );
    stage = "draft";
    data.approvedBy = null;
    data.approvedAt = null;
  }
  if (!isEditor(user) && !["draft", "in_review"].includes(stage))
    stage = "draft";
  data.reviewStatus = stage;
  if (stage === "in_review" && original.reviewStatus !== "in_review")
    data.submittedAt = new Date().toISOString();
  if (data._status === "published") {
    if (
      !isEditor(user) ||
      stage !== "approved" ||
      original.reviewStatus !== "approved"
    )
      throw new APIError(
        "A saved editorial approval is required before publication.",
        403,
      );
    if (
      !merged.title ||
      !merged.slug ||
      !merged.standfirst ||
      !merged.section ||
      !Array.isArray(merged.contributors) ||
      !merged.contributors.length
    )
      throw new APIError(
        "A title, slug, standfirst, section and byline are required for publication.",
        400,
      );
    const date = String(
      data.publishedAt || original.publishedAt || new Date().toISOString(),
    );
    if (Number.isNaN(Date.parse(date)))
      throw new APIError("Use a valid publication date.", 400);
    data.publishedAt = date;
    if (
      original.firstPublishedAt &&
      Date.parse(String(original.firstPublishedAt)) <= Date.now() &&
      Date.parse(date) > Date.now()
    )
      throw new APIError(
        "Keep the original publication time for live story updates. Save changes as a draft until they are ready to publish.",
        400,
      );
    if (!original.firstPublishedAt) data.firstPublishedAt = date;
    const ids = [relationId(merged.hero), ...mediaIds(merged.body)].filter(
      (id): id is number | string => id !== undefined,
    );
    for (const id of merged.contributors as Array<unknown>) {
      const contributor = await req.payload.findByID({
        collection: "contributors",
        id: relationId(id)!,
        user,
        overrideAccess: false,
        depth: 0,
        req,
      });
      const portrait = relationId(contributor.portrait);
      if (portrait) ids.push(portrait);
    }
    data.linkedMedia = [...new Set(ids)];
    for (const id of ids) {
      const asset = await req.payload.findByID({
        collection: "media",
        id,
        user,
        overrideAccess: false,
        depth: 0,
        req,
      });
      if (
        !asset.alt ||
        !asset.credit ||
        !asset.rightsConfirmed ||
        !asset.licenseType ||
        (asset.licenseExpiresAt &&
          Date.parse(asset.licenseExpiresAt) <=
            Math.max(Date.now(), Date.parse(date)))
      )
        throw new APIError(
          "Every published image requires alt text, credit, confirmed rights and an unexpired licence.",
          400,
        );
    }
  }
  return data;
};
