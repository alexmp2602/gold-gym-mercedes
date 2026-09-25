import AuthForm from '@/components/auth-form';
import { authConfigured } from '@/lib/auth/config';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Cambiar contraseña', robots: { index: false, follow: false } };
export default function Page() { return <AuthForm mode="password" configured={authConfigured()} />; }
