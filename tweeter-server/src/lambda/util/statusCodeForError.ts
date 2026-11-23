// AI-assisted: see AI-ATTRIBUTION.md

// Lambda proxy integration means API Gateway never sees a thrown error to
// pattern-match against - every handler already catches and formats its own
// response, so status codes are assigned here by message prefix instead.
export function statusCodeForError(error: unknown): number {
  const message = error instanceof Error ? error.message : String(error);

  if (message.startsWith("[Unauthorized]")) {
    return 401;
  }

  if (message.startsWith("[BadRequest]")) {
    return 400;
  }

  return 500;
}
