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
