import { clsx } from "clsx";

/** BEM / SCSS class combiner */
export function cx(...inputs) {
    return clsx(inputs);
}

export function formatCurrency(amount) {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)}Cr`;
    }
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPercent(value) {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
