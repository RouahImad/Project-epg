export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    // format to DD/MM/YYYY
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
export const formatDateTime = (date: string | Date): string => {
    const d = new Date(date);
    // format to DD/MM/YYYY HH:mm
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) // output ex: from 1234.56 to 1,234.56 MAD
        .format(amount)
        .replace("MAD", "DH");
};

export const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString(); //output ex: 1234 to 1.2K
};

export const formatMoneyCompact = (amount: number): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M DH`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K DH`;
    } else {
        return formatMoney(amount);
    }
}; // output ex: from 1234.56 to 1.2K DH
