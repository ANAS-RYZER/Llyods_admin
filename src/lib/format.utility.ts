export const formatCurrency = (value: number): string => {
  return isNaN(value)
    ? " 0"
    : value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

export const formatPercentage = (value: number): string => {
  return isNaN(value) ? "0%" : `${parseFloat(value.toFixed(6))}%`;
};

export const safeFormatCurrency = (value: any): string => {
  if (
    typeof value === undefined ||
    value === null ||
    isNaN(parseFloat(value))
  ) {
    return formatCurrency(0);
  }
  if (typeof value === "number") {
    return formatCurrency(value);
  }
  return formatCurrency(parseFloat(value));
};

export const safeFormatPercentage = (value: any): string => {
  if (
    typeof value === undefined ||
    value === null ||
    isNaN(parseFloat(value))
  ) {
    return formatPercentage(0);
  }
  if (typeof value === "number") {
    return formatPercentage(Number(value.toFixed(2)));
  }
  return formatPercentage(Number(parseFloat(value).toFixed(2)));
};

export const toTitleCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const calculateIRR = ({
  P0,
  R0,
  e,
  d,
  id,
  r,
  ir,
  g,
  T,
}: {
  P0: number;
  R0: number;
  e: number;
  d: number;
  id: number;
  r: number;
  ir: number;
  g: number;
  T: number;
}) => {
  const npv = (rate: number) => {

    let total = -P0; // initial investment
    for (let t = 1; t <= T; t++) {
      const rent = R0 * Math.pow(1 + e, t - 1);
      // console.log('Rent for year', t, ':', rent);
      const depositIncome = d * id;
      const reserveIncome = r * ir;

      let cashflow = rent + depositIncome + reserveIncome;

      // Add sale proceeds in final year
      if (t === T) {
        cashflow += P0 * Math.pow(1 + g, T);
      }

      total += cashflow / Math.pow(1 + rate, t);
    }
    return total;
  };

  // Binary search for IRR
  let low = -0.99,
    high = 1,
    mid;
  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const val = npv(mid);
    if (Math.abs(val) < 1e-6) break;
    if (val > 0) low = mid;
    else high = mid;
  }
  return mid || 0;
};

export const calculateMOIC = ({
  P0,
  R0,
  e,
  d,
  id,
  r,
  ir,
  g,
  T,
}: {
  P0: number;
  R0: number;
  e: number;
  d: number;
  id: number;
  r: number;
  ir: number;
  g: number;
  T: number;
}) => {
  let totalReturn = 0;

  // Years 1 to T-1
  for (let t = 1; t < T; t++) {
    const rent = R0 * Math.pow(1 + e, t - 1);
    const depositIncome = d * id;
    const reserveIncome = r * ir;
    totalReturn += rent + depositIncome + reserveIncome;
  }

  // Final year (T)
  const rentFinal = R0 * Math.pow(1 + e, T - 1);
  const depositIncomeFinal = d * id;
  const reserveIncomeFinal = r * ir;
  const saleProceeds = P0 * Math.pow(1 + g, T);

  totalReturn +=
    rentFinal + depositIncomeFinal + reserveIncomeFinal + saleProceeds;

  // MOIC = Total returns / Initial investment
  return totalReturn / P0;
};
