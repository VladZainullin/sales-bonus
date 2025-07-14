/**
 * Функция для расчета прибыли
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчет прибыли от операции
    const {discount, sale_price, quantity} = purchase;
    return _product.purchase_price - sale_price * quantity * (1 - discount / 100);
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

    if (index === 1) {
        return 0.15 * profit;
    }

    if (index === 2 || index === 3) {
        return 0.1 * profit;
    }

    if (index === total) {
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

    const {calculateRevenue, calculateBonus} = options;

    let result = data.sellers
        .map(seller => ({
            seller_id: seller.id,
            name: seller.first_name + ' ' + seller.last_name,
            revenue: data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .reduce((a, b) => a.total_amount + b.total_amount, 0),
            profit: data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .map(purchase => calculateRevenue(purchase, data.find(p => p.sku === purchase.sku)))
                .reduce((a, b) => a + b, 0),
            sales_count: data.purchase_records.filter(purchase => purchase.seller_id === seller.id).length,
            top_products: data.purchase_records
                .filter(purchase => purchase.seller_id === seller.id)
                .map(purchase => ({
                    sku: purchase.sku,
                    quantity: purchase.quantity,
                }))
                .toSorted((a, b) => b.quantity - a.quantity)
                .slice(0, 10)

        }))
        .toSorted((a, b) => b.profit - a.profit)
        .map((seller, index, array) => ({
            ...seller,
            bonus: calculateBonus(index, array.length, seller)
        }));

    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}