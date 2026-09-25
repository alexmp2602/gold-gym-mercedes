import Account from '@/components/account';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mi cuenta', robots: { index: false, follow: false } };
export default function Page() { return <Account />; }
