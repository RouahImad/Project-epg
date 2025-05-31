import { db } from "../config/database";
import { ActivityLog, User } from "../types/index";
import { LogsWithUserName } from "../types/User.types";

export const getActivities = async (): Promise<LogsWithUserName[]> => {
    const [rows] = await db.query(
        `SELECT al.*, users.fullName as username 
        FROM activity_logs al 
        join users on al.userId = users.id`
    );
    return rows as LogsWithUserName[];
};

export const getActivitiesByUserId = async (
    id: User["id"]
): Promise<LogsWithUserName[]> => {
    const [rows] = await db.query(
        `SELECT al.*, users.fullName AS username
        FROM activity_logs al
        JOIN users ON al.userId = users.id
        WHERE al.userId = ?;`,
        [id]
    );

    return rows as LogsWithUserName[];
};

export const insertActivity = async (
    activity: Omit<ActivityLog, "id" | "timestamp">
): Promise<boolean> => {
    const {
        userId,
        action,
        entityType,
        entityId,
        details = {}, // Default to empty object if not provided
    } = activity;

    try {
        await db.query(
            "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
            [
                userId,
                action,
                entityType,
                entityId,
                JSON.stringify(details), // Convert details to JSON string
            ]
        );
        return true;
    } catch (error) {
        console.error("Error inserting activity:", error);
        return false;
    }
};

export const updateActivity = async (
    id: ActivityLog["id"],
    activity: Pick<ActivityLog, "action">
): Promise<boolean> => {
    const { action } = activity;

    if (!action) return false;

    try {
        await db.query("UPDATE activity_logs SET action = ? WHERE id = ?", [
            action,
            id,
        ]);
        return true;
    } catch (error) {
        console.error("Error updating activity:", error);
        return false;
    }
};

export const deleteActivity = async (
    id: ActivityLog["id"]
): Promise<boolean> => {
    try {
        await db.query("DELETE FROM activity_logs WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting activity:", error);
        return false;
    }
};
