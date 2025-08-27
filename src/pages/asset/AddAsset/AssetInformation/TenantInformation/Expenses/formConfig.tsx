import { FormFieldConfig } from "@/components/UseForm/ControllerMap";
import { calculateIRR, calculateMOIC } from "@/lib/format.utility";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const formConfig = (): FormFieldConfig[] => {
  const { control, getValues, watch, setValue } = useFormContext();
  const totalNumberOfSfts = watch("totalNumberOfSfts") || 0;
  const vacancyRate = watch("rentalInformation.vacancyRate") || 0;
  const rentPerSft = watch("rentalInformation.rentPerSft") || 0;
  const fields = watch("expenses") || [];
  const totalPropertyValueAfterFees =
    watch("totalPropertyValueAfterFees") || 0;
  // const 
  const basePropertyValue = getValues("basePropertyValue") || 0;
  console.log("base ", basePropertyValue);
  const tenants = getValues("tenants") || [];
  const tenantArray = Array.isArray(tenants) ? tenants : [];

  const { year1Total, year2Total } = tenantArray.reduce(
    (acc: any, tenant: any) => {
      const year1Rent = tenant.rentPerSft * tenant.sftsAllocated * 12;
      const year2Rent = year1Rent * (1 + tenant.annualRentEscalation / 100);

      acc.year1Total += year1Rent;
      acc.year2Total += year2Rent;

      return acc;
    },
    { year1Total: 0, year2Total: 0 }
  );

  const avgEscalation =
    year1Total > 0 ? (year2Total - year1Total) / year1Total : 0;

  //calcualte the totaldeposit amount
  const totalDeposit = tenants.reduce((total: number, tenant: any) => {
    return total + (tenant.securityDeposit || 0);
  }, 0);

  //calacualte interest rate on deposit
  const { totalInterest, totalDeposits } = tenants.reduce(
    (acc: any, tenant: any) => {
      const interest =
        tenant.securityDeposit * (tenant.interestOnSecurityDeposit / 100);
      acc.totalInterest += interest;
      acc.totalDeposits += tenant.securityDeposit;
      return acc;
    },
    { totalInterest: 0, totalDeposits: 0 }
  );

  const avgInterestOnDeposit =
    totalDeposits > 0 ? totalInterest / totalDeposits : 0;

  let rentNumberOfSfts =
    totalNumberOfSfts - (vacancyRate / 100) * totalNumberOfSfts || 0;

  let grossRent = rentPerSft * rentNumberOfSfts || 0;
  grossRent = parseFloat(grossRent.toFixed(2));

  // Calculate total expenses
  const expenses = fields.reduce((total: number, field: any) => {
    if (field.status && field.value) {
      return (
        total +
        (field.isPercentage ? (grossRent * field.value) / 100 : field.value)
      );
    }
    return total;
  }, 0);

  const grossAnnualRent = grossRent * 12 || 0;

  let netAnnualRent = grossAnnualRent - expenses * 12 || 0;
  netAnnualRent = parseFloat(netAnnualRent.toFixed(2));

  const grossrentalYield = parseFloat(
    totalPropertyValueAfterFees && grossAnnualRent
      ? ((grossAnnualRent / totalPropertyValueAfterFees) * 100).toFixed(2)
      : "0"
  );

  const netRentalYield = parseFloat(
    totalPropertyValueAfterFees && netAnnualRent
      ? ((netAnnualRent / totalPropertyValueAfterFees) * 100).toFixed(2)
      : "0"
  );
  console.log(
    "netRentalYield",
    totalPropertyValueAfterFees,
    netRentalYield,
    grossrentalYield
  );

  const reserveAmount =
    getValues("fees.reserve")?.reduce((acc: number, fee: any) => {
      if (fee.status) {
        return (
          acc +
          (fee.isPercentage
            ? (basePropertyValue * fee.value) / 100
            : fee.value)
        );
      }
      return acc;
    }, 0) || 0;
    console.log("reserveAmount", reserveAmount);

  const irr = calculateIRR({
    P0: totalPropertyValueAfterFees,
    R0: netAnnualRent,
    e: avgEscalation,
    d: totalDeposit,
    id: avgInterestOnDeposit,
    r: reserveAmount,
    ir: (getValues("investmentPerformance.interestRateonReserves") || 0) / 100,
    g:
      (getValues("investmentPerformance.targetCapitalAppreciation") || 0) / 100,
    T:
      getValues("investmentPerformance.estimatedReturnsAsPerLockInPeriod") || 0,
  });

  const moic = calculateMOIC({
    P0: totalPropertyValueAfterFees,
    R0: netAnnualRent,
    e: avgEscalation,
    d: totalDeposit,
    id: avgInterestOnDeposit,
    r: reserveAmount,
    ir: (getValues("investmentPerformance.interestRateonReserves") || 0) / 100,
    g:
      (getValues("investmentPerformance.targetCapitalAppreciation") || 0) / 100,
    T:
      getValues("investmentPerformance.estimatedReturnsAsPerLockInPeriod") || 1,
  });
  useEffect(() => {
    setValue("investmentPerformance.netRentalYield", netRentalYield);
    setValue("investmentPerformance.grossRentalYield", grossrentalYield);
    setValue("investmentPerformance.irr", irr*100);
    setValue("investmentPerformance.moic", moic);
    setValue("totalPropertyValueAfterFees", totalPropertyValueAfterFees);
    
  }, [netRentalYield, setValue]);
  return [
    {
      type: "number",
      name: "totalNumberOfSfts",
      control,
      label: "Total Area (sqft)",
      // placeholder: "Enter Total Area",
      disabled: true,
    },
    {
      type: "number",
      name: "rentalInformation.rentPerSft",
      control,
      label: "Rent per sqft",
      placeholder: "Enter Price per sqft",
      disabled: true,
    },
    {
      type: "number",
      name: "rentalInformation.vacancyRate",
      control,
      label: "Approx Vacancy Rate(%)",
      placeholder: "Enter Vacancy Rate",
      disabled: true,
    },
    {
      type: "number",
      name: "totalPropertyValueAfterFees",
      control,
      label: "Gross Total Property Value",
      disabled: true,
      placeholder: "Gross Total",
      defaultValue: totalPropertyValueAfterFees,
    },
    {
      name: "investmentPerformance.netRentalYield",
      label: "Net Rental Yield (%)",
      type: "text",
      control,
      disabled: true,
    },
    {
      name: "investmentPerformance.grossRentalYield",
      label: "Gross Rental Yield (%)",
      type: "text",
      control,
      disabled: true,
    },
    {
      name: "assumpationsEsclation",
      label: "Average Annual Escalation (%)",
      type: "number",
      control: control,
      defaultValue: (avgEscalation * 100).toFixed(2),
      placeholder: "Enter Assumptions Esclation",
      disabled: true,
    },
    {
      name: "totalDeposit",
      label: "Total Deposit Amount",
      type: "text",
      control: control,
      defaultValue: totalDeposit.toString(),
      disabled: true,
    },
    {
      name: "assumptionInterestRateonDeposit",
      label: "Average Interest Rate on Deposit (%)",
      type: "text",
      control: control,
      defaultValue: (avgInterestOnDeposit * 100).toFixed(2),
      disabled: true,
    },
    {
      name: "investmentPerformance.irr",
      label: "IRR (%)",
      type: "number",
      control,
      disabled: true,
    },
    {
      name: "investmentPerformance.moic",
      label: "MOIC ",
      type: "number",
      control,
      disabled: true,
    },
  ];
};

export const expenseFormConfig = (index: number): FormFieldConfig[] => {
  const { control } = useFormContext();
  return [
    {
      type: "text",
      name: `expenses.${index}.name`,
      control,
      label: "Expense Name",
      placeholder: "Enter Expense Name",
      rules: {
        required: "Expense name is required",
      },
    },
    {
      type: "number",
      name: `expenses.${index}.value`,
      control,
      label: "value",
      placeholder: "Enter value",
      rules: {
        required: "Value is required",
        validate: (value: number) => {
          if (value < 0) {
            return "Value cannot be negative";
          }
          return true;
        },
      },
    },
    {
      type: "switch",
      name: `expenses.${index}.isPercentage`,
      control,
      label: "Is Percentage",
      placeholder: "Is Percentage",
    },
    {
      type: "switch",
      name: `expenses.${index}.status`,
      control,
      label: "Status",
      placeholder: "Status",
    },
  ];
};
