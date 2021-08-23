const calculate = (productPrice, data, params) => {
  const count = repaymentCount(
    data.repayment_duration_id.value,
    data.repayment_cycle_id.value
  );
  
  const marketPrice = Math.floor(productPrice * (1 + params.margin))
  const downPay = Math.floor((data.payment_type_id.percent / 100) * marketPrice);
  const residual = Math.floor(marketPrice - downPay);
  const tempInstallment = residual / count;
  const tempInterest = residual * (params.interest / 100);
  const totalTempInterest = (tempInstallment * count) + (tempInterest * count) + downPay;
  const labelPrice = totalTempInterest * (1 + params.tax / 100);
  let total = labelPrice;
  const initDownpayment = ((data.payment_type_id.percent / 100) * total);
  const downpayment = initDownpayment + (Math.floor(((total - initDownpayment) / count)) * data.payment_type_id.plus);
  const actualDownpayment = Math.floor(downpayment / 100) * 100;
  const actualRepayment = total - downpayment;
  total = Math.ceil(labelPrice / 100) * 100;
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
