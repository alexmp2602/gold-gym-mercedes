import type { Metadata } from "next";
import PadelAgenda from "@/components/padel-agenda";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Agenda de pádel",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <PadelAgenda />;
}
