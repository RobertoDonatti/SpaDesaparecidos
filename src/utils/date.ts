
export function formatDateBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

// "4 dias", "2 meses", "1 ano"
export function sinceBR(iso?: string | null) {
  if (!iso) return "—";
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();

  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (year >= 1) {
    return year === 1 ? "1 ano" : `${year} anos`;
  }
  if (month >= 1) {
    return month === 1 ? "1 mês" : `${month} meses`;
  }
  if (day >= 1) {
    return day === 1 ? "1 dia" : `${day} dias`;
  }
  return "hoje";
}
