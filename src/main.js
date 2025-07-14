/**
 * Функция для расчета прибыли
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчет прибыли от операции
    const {discount, sale_price, quantity} = purchase;
    return sale_price * quantity * (1 - discount / 100) - _product.purchase_price;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    let {profit} = seller;

    if (index === 0) {
        return 0.15 * profit;
    }

    if (index === 1 || index === 2) {
        return 0.1 * profit;
    }

    if (index === total - 1) {
        return 0;
    }

    return 0.05 * profit;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {

    if (!data) {
        throw new Error('Входные данные отсутствуют');
    }

    if (data.products.length === 0
        || !Array.isArray(data.products)) {
        throw new Error('Некорректные данные товаров');
    }

    if (data.customers.length === 0
        || !Array.isArray(data.customers)) {
        throw new Error('Некорректные данные покупателей');
    }

    if (data.sellers.length === 0
        || !Array.isArray(data.sellers)
    ) {
        throw new Error('Некорректные данные продавцов');
    }

    if (data.purchase_records.length === 0
        || !Array.isArray(data.purchase_records)) {
        throw new Error('Некорректные данные записей о продажах');
    }

    const {calculateRevenue, calculateBonus} = options;

    return data.sellers
        .map(seller => ({
            seller_id: seller.id,
            name: seller.first_name + ' ' + seller.last_name,
            revenue: +data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .map(purchase => purchase.total_amount)
                .reduce((a, b) => a + b, 0)
                .toFixed(2),
            profit: +data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .flatMap(purchase => purchase.items)
                .map(purchaseItem => calculateRevenue(
                    purchaseItem,
                    data.products.find(p => p.sku === purchaseItem.sku)))
                .reduce((a, b) => a + b, 0)
                .toFixed(2),
            sales_count: data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id).length,
            top_products: data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .flatMap(purchase => purchase.items)
                .map(purchaseItem => ({
                    sku: purchaseItem.sku,
                    quantity: purchaseItem.quantity,
                }))
                .toSorted((a, b) => b.quantity - a.quantity)
                .slice(0, 10)

        }))
        .toSorted((a, b) => b.profit - a.profit)
        .map((seller, index, array) => ({
            ...seller,
            bonus: +calculateBonus(index, array.length, seller).toFixed(2)
        }));
}