function downPaymentSort (a, b){
    if (a.percent + a.plus < b.percent + b.plus) return -1;
    if (a.percent + a.plus > b.percent + b.plus) return 1;
    return 0;
}
export default downPaymentSort