"use server";

import { getPassportDetail } from "@/lib/passport-data";
import type { PassportDetail } from "@/lib/passport";

/** Load a single passport's destinations on demand (keeps the dataset server-side). */
export async function loadPassportDetail(
  name: string,
): Promise<PassportDetail | null> {
  return getPassportDetail(name);
}
