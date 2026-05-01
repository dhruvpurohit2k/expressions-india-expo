export function tileColor(seed: string | number): string {
  let h = typeof seed === "number" ? Math.abs(seed) : 0;
  if (typeof seed === "string") {
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue}, 65%, 94%)`;
}
