export function calculateLineTotal(item) {
    const qty = item.quantity;
    const base = qty * item.rate;
    const gstAmount = base * (item.gst / 100);
    const labourAmount = item.labour;
    const subtotal = base + gstAmount + labourAmount;
    const marginAmount = subtotal * (item.margin / 100);
    const total = subtotal + marginAmount;
    return {
        lineId: item.id,
        base,
        gstAmount,
        labourAmount,
        marginAmount,
        total,
    };
}
export function calculateBoqEstimate(items) {
    const lineEstimates = items.map(calculateLineTotal);
    return lineEstimates.reduce((acc, le) => ({
        subtotal: acc.subtotal + le.base,
        gst: acc.gst + le.gstAmount,
        labour: acc.labour + le.labourAmount,
        margin: acc.margin + le.marginAmount,
        grandTotal: acc.grandTotal + le.total,
        lineEstimates: acc.lineEstimates,
    }), {
        subtotal: 0,
        gst: 0,
        labour: 0,
        margin: 0,
        grandTotal: 0,
        lineEstimates,
    });
}
export function groupEstimateByTrade(items) {
    const totals = {};
    items.forEach((item) => {
        const trade = item.tradeId ?? "miscellaneous";
        const { total } = calculateLineTotal(item);
        totals[trade] = (totals[trade] ?? 0) + total;
    });
    return totals;
}
export function groupEstimateByRoom(items) {
    const totals = {};
    items.forEach((item) => {
        const room = item.room || "General";
        const { total } = calculateLineTotal(item);
        totals[room] = (totals[room] ?? 0) + total;
    });
    return totals;
}
