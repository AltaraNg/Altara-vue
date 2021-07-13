const calculate = (productPrice, data, params) => {
  const count = repaymentCount(
    data.repayment_duration_id.value,
    data.repayment_cycle_id.value
  );

  const marketPrice = productPrice * (1 + params.margin)
  const upFront = (data.payment_type_id.percent / 100) * marketPrice;
  
  const residual = marketPrice - upFront;
  const tempInstallment = residual / count;
  const tempInterest = residual * (params.interest / 100);

  const totalPremium = (tempInstallment * count) + ( tempInterest * count ) + upFront;
  const labelPrice = totalPremium * (1 + params.tax / 100);
  const total = Math.ceil(labelPrice / 100) * 100;
  
  const initDownpayment = ((data.payment_type_id.percent / 100) * total);
  const downpayment = initDownpayment + ( ((total - initDownpayment) / count) * data.payment_type_id.plus);
  const actualDownpayment = Math.floor( downpayment / 100) * 100;
  const actualRepayment = +(total - actualDownpayment).toFixed(1);

  return { total, actualDownpayment, actualRepayment };
};


const repaymentCount = (days, cycle) => {
  const result = days / cycle;
  if (result >= 24) {
    return 24;
  } else if (result >= 12) {
    return 12;
  }
  if (result >= 6) {
    return 6;
  }
  return 3;
};

export default calculate;
