import { database } from "@/lib/server";
export type PadelSettings = {
  padel_price: number;
  booking_days: number;
  cancel_hours: number;
};
export async function padelSettings(owner: string): Promise<PadelSettings> {
  return (
    (await database()
      .prepare(
        "SELECT padel_price,booking_days,cancel_hours FROM settings WHERE owner=?",
      )
      .bind(owner)
      .first<PadelSettings>()) ?? {
      padel_price: 24000,
      booking_days: 30,
      cancel_hours: 24,
    }
  );
}
