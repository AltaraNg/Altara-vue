const calculate = (productPrice, data, params, percentage_discount) => {
  const count = repaymentCount(data.repayment_duration_id.value, 14);
  const marketPrice = Math.floor(productPrice * (1 + params.margin));
  const upFront = Math.floor(
    (data.payment_type_id.percent / 100) * marketPrice
  );
  const residual = Math.floor(marketPrice - upFront);
  const tempInstallment = residual / count;
  const tempInterest = residual * (params.interest / 100);
  const totalPremium = tempInstallment * count + tempInterest * count + upFront;
  const labelPrice = totalPremium * (1 + params.tax / 100);
  let total = labelPrice;
  const initDownpayment = (data.payment_type_id.percent / 100) * total;
  const downpayment =
    initDownpayment +
    Math.floor((total - initDownpayment) / count) * data.payment_type_id.plus;
  const actualDownpayment = Math.floor(downpayment / 100) * 100;
  const tempActualRepayment = +(total - downpayment).toFixed(2);
  var biMonthlyRepayment = Math.round(tempActualRepayment / count / 100) * 100;
  const actualRepayment = biMonthlyRepayment * count;
  var rePayment = 0;
  if (percentage_discount > 0) {
    rePayment = actualRepayment - (actualRepayment * percentage_discount) / 100;
  } else {
    rePayment = actualRepayment;
  }
  total = actualRepayment + actualDownpayment;

  return { total, actualDownpayment, rePayment };
};
const repaymentCount = (days, cycle) => {
  const result = days / cycle;
  if (result >= 24) {
    return 24;
  } else if (result >= 18) {
    return 18;
  } else if (result >= 12) {
    return 12;
  }
  if (result >= 6) {
    return 6;
  }
  return 3;
};

const cashLoan = (productPrice, data, params, percentage_discount) => {
  const count = repaymentCount(data.repayment_duration_id.value, 14);
  const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;
  const residual = productPrice - actualDownpayment;
  const principal = residual / count;
  const interest = (params.interest / 100) * residual;
  const tempActualRepayment = (principal + interest) * count;
  var biMonthlyRepayment = Math.round(tempActualRepayment / count / 100) * 100;
  const actualRepayment = biMonthlyRepayment * count;
  let total = Math.ceil((actualDownpayment + actualRepayment) / 100) * 100;
  var rePayment = 0;
  if (percentage_discount > 0) {
    rePayment = actualRepayment - (actualRepayment * percentage_discount) / 100;
  } else {
    rePayment = actualRepayment;
  }
  total = actualRepayment + actualDownpayment;
  return { total, actualDownpayment, rePayment };
};

const decliningRepaymentCalculator = (
  productPrice,
  data,
  params,
  percentage_discount
) => {
  const factors = [2, 1.5, 0.5, 0];
  const count = repaymentCount(data.repayment_duration_id.value, 14);
  const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;

  const residual = productPrice - actualDownpayment;
  const normalInstallment = residual / count;
  const relativePercentage = normalInstallment / residual;
  const percentages = factors.map((factor) =>
    computePercentage(factor, relativePercentage)
  );
  const interestOnNormalSingleInstallment = (params.interest / 100) * residual;
  const repayments = populateDecliningRepaymentAmounts(
    percentages,
    residual,
    interestOnNormalSingleInstallment,
    count
  );
  const discountTedRepayment = applyDiscount(repayments, percentage_discount);

  const sumOfRepayments = repayments.reduce(
    (partialSum, nextNumber) => partialSum + nextNumber,
    0
  );

  const sumOfDiscountedRepayments = discountTedRepayment.reduce(
    (partialSum, nextNumber) => partialSum + nextNumber,
    0
  );
  const total = sumOfRepayments + actualDownpayment;
  const discountedTotal = sumOfDiscountedRepayments + actualDownpayment;
  return {
    actualDownpayment: actualDownpayment.toFixed(2),
    total: total.toFixed(2),
    rePayment: sumOfRepayments.toFixed(2),
    discountedTotal: discountedTotal.toFixed(2),
    discountedRepayment: sumOfDiscountedRepayments.toFixed(2),
  };
};

const computePercentage = (factor, relativePercentage) => {
  return factor * relativePercentage * 100;
};

const computeDecliningRepaymentAmount = (
  percentage,
  residual,
  interestOnNormalSingleInstallment
) => {
  return (percentage / 100) * residual + interestOnNormalSingleInstallment;
};

const applyDiscount = (repayments, discount) => {
  if (discount <= 0) {
    return repayments;
  }
  return repayments.map(
    (repayment) => repayment - repayment * (discount / 100)
  );
};

const populateDecliningRepaymentAmounts = (
  percentages,
  residual,
  interestOnNormalSingleInstallment
) => {
  const repayments = [];
  percentages.forEach(function (percentage) {
    let amount = computeDecliningRepaymentAmount(
      percentage,
      residual,
      interestOnNormalSingleInstallment
    );
    const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100; //round amount to 2 decimal place and conver
    const repeatedAmount = Array(percentages.length - 1).fill(roundedAmount);
    repayments.push(...repeatedAmount);
  });
  return repayments;
};
const decliningRepaymentCalculatorForThreeMonths = (
  productPrice,
  data,
  params,
  percentage_discount
) => {
  const percentages = [
    0.269482435205326, 0.166738587360158, 0.0639947395149903,
  ];
  const repayments = [];
  const count = repaymentCount(data.repayment_duration_id.value, 14);
  const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;
  const residual = productPrice - actualDownpayment;
  const normalInstallment = residual / count;
  const normalInstallmentAndInterest =
    normalInstallment + (params.interest / 100) * residual;
  const totalNormalInstallmentAndInterest =
    normalInstallmentAndInterest * count;

  const totalNormalInstallmentAndInterestAndDownpayment =
    totalNormalInstallmentAndInterest + actualDownpayment;

  const labelPrice =
    (params.tax / 100) * totalNormalInstallmentAndInterestAndDownpayment +
    totalNormalInstallmentAndInterestAndDownpayment;

  const decliningDownpayment =
    (data.payment_type_id.percent / 100) * labelPrice;
  const decliningResidual = labelPrice - decliningDownpayment;
  percentages.forEach((percentage) => {
    const repayment = percentage * decliningResidual;
    repayments.push(repayment);
    repayments.push(repayment);
  });
  const discountTedRepayment = applyDiscount(repayments, percentage_discount);
  const sumOfRepayments = repayments.reduce(
    (partialSum, nextNumber) => partialSum + nextNumber,
    0
  );
  const sumOfDiscountedRepayments = discountTedRepayment.reduce(
    (partialSum, nextNumber) => partialSum + nextNumber,
    0
  );
  const total = sumOfRepayments + decliningDownpayment;
  const discountedTotal = sumOfDiscountedRepayments + decliningDownpayment;
  return {
    actualDownpayment: decliningDownpayment.toFixed(2),
    total: total.toFixed(2),
    rePayment: sumOfRepayments.toFixed(2),
    discountedTotal: discountedTotal.toFixed(2),
    discountedRepayment: sumOfDiscountedRepayments.toFixed(2),
  };
};
export {
  calculate,
  cashLoan,
  decliningRepaymentCalculator,
  decliningRepaymentCalculatorForThreeMonths,
};
