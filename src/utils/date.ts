
export function formatDateBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

// "há 3 dias", "há 2 meses"
export function sinceBR(iso?: string | null) {
  if (!iso) return "—";
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();

  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);
  const month = Math.round(day / 30);
  const year = Math.round(day / 365);

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  if (Math.abs(year) >= 1)  return rtf.format(-year, "year");
  if (Math.abs(month) >= 1) return rtf.format(-month, "month");
  if (Math.abs(day) >= 1)   return rtf.format(-day, "day");
  if (Math.abs(hour) >= 1)  return rtf.format(-hour, "hour");
  if (Math.abs(min) >= 1)   return rtf.format(-min, "minute");
  return rtf.format(-sec, "second");
}
