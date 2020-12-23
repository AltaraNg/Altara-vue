class Orders {
    constructor(id, customer, customer_id, discount, discount_id, down_payment, floor_agent, order_date, payment_method, product_price, product_sku, reminders, repayment_amount, repayment_formal, repayment_informal, sales_agent_id, sales_category, sales_category_id, sales_type_id, status, status_id, store_product ){
        this._id = id;
        this._customer = customer;
        this._customer_id = customer_id;
        this._discount = discount;
        this._discount_id = discount_id;
        this._down_payment = down_payment;
        this._floor_agent = floor_agent;
        this._order_date = order_date;
        this._payment_method = payment_method;
        this._product_price = product_price;
        this._product_sku = product_sku;
        this._reminders = reminders;
        this._repayment_amount = repayment_amount;
        this._repayment_formal = repayment_formal;
        this._repayment_informal = repayment_informal;
        this._sales_agent_id = sales_agent_id;
        this._sales_category = sales_category;
        this._sales_category_id = sales_category_id;
        this._sales_type_id = sales_type_id;
        this._status = status;
        this._status_id = status_id;
        this._store_product = store_product;

    }
}
export default Orders;