export { env } from "cloudflare:workers";
export const supportsSitesIdentity = true;
export async function independentUserId(): Promise<string | null> { return null; }
export function ownerAccount(_userId: string) { return false; }
