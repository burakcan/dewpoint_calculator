export function dewPoint(Tc: number, R: number): number {
  if (Tc < 0 || Tc > 60) {
    return Tc;
  }

  if (R < 0.01 || R > 1) {
    return Tc;
  }

  const a = 17.27;
  const b = 237.7;

  const alphaTR = (a * Tc) / (b + Tc) + Math.log(R);

  const Tr = (b * alphaTR) / (a - alphaTR);

  if (Tr < 0 || Tr > 50) {
    return Tc;
  }

  return Tr;
}
