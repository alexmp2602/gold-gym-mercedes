import { getPostgresDatabase } from './postgres/database';
export { independentUserId } from './auth/client';
export { ownerAccount } from './auth/config';
export const env = { get DB() { return getPostgresDatabase(); } };
export const supportsSitesIdentity = false;
