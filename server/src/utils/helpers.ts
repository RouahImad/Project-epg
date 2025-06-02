import { LogsWithUserName } from "../types/";

export const formatDate = (
    date?: Date | string,
    format: "YYYY-MM-DD" | "MM-DD-YYYY" = "YYYY-MM-DD"
): string => {
    const d = new Date(date || Date.now());
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    if (format === "MM-DD-YYYY") {
        return `${month}-${day}-${year}`;
    }
    return `${year}-${month}-${day}`;
};

export const isValidDate = (date: string): boolean => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
};

export const formatActivities = (logs: LogsWithUserName[]) =>
    logs
        .sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        )
        .map((activity) => ({
            userId: activity.userId,
            userName: activity.username,
            action: activity.action,
            entityType: activity.entityType,
            entityId: activity.entityId,
            details: activity.details,
            timestamp: new Date(activity.timestamp).toLocaleString(),
        }));
