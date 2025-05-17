import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { User } from "./usersModel";

export interface Activity {
    id: number;
    userId: User["id"];
    action: string;
    timestamp: Date;
}

export const getActivities = async (): Promise<Activity[]> => {
    const [rows] = await db.query("SELECT * FROM activities");
    return rows as Activity[];
};

export const getActivityById = async (
    id: Activity["id"]
): Promise<Activity | null> => {
    const [row] = await db.query("SELECT * FROM activities WHERE id = ?", [id]);
    const activities = row as Activity[];

    return activities.length > 0 ? activities[0] : null;
};

export const insertActivity = async (
    activity: WithOptional<Activity, "id" | "timestamp">
): Promise<boolean> => {
    const { userId, action } = activity;

    try {
        await db.query(
            "INSERT INTO activities (userId, action, timestamp) VALUES (?, ?, ?)",
            [userId, action, new Date()]
        );
        return true;
    } catch (error) {
        console.error("Error inserting activity:", error);
        return false;
    }
};

export const updateActivity = async (
    id: Activity["id"],
    activity: Pick<Activity, "action">
): Promise<boolean> => {
    const { action } = activity;

    if (!action) return false;

    try {
        await db.query("UPDATE activities SET action = ? WHERE id = ?", [
            action,
            id,
        ]);
        return true;
    } catch (error) {
        console.error("Error updating activity:", error);
        return false;
    }
};

export const deleteActivity = async (id: Activity["id"]): Promise<boolean> => {
    try {
        await db.query("DELETE FROM activities WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting activity:", error);
        return false;
    }
};
