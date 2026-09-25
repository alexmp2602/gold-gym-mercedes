import AuthForm from '@/components/auth-form';
import { authConfigured } from '@/lib/auth/config';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ingresar', robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  return <AuthForm mode="login" configured={authConfigured()} initialError={query.error === 'link' ? 'El enlace venció, ya fue utilizado o se abrió en otro navegador. Solicitá uno nuevo.' : ''} initialMessage={query.changed === '1' ? 'Contraseña actualizada. Ya podés iniciar sesión.' : ''} />;
}
