// Vercel cannot use Workers bindings or trust Sites identity headers.
// Keep private services unavailable until an independent backend is configured.
export const env: { DB?: D1Database } = {};
export const supportsSitesIdentity = false;
