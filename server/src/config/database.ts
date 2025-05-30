import mysql from "mysql2/promise";

const sqlDb = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Check if all required DB variables are defined
// if (!sqlDb.host || !sqlDb.user || !sqlDb.password || !sqlDb.database) {
//     console.error(
//         "Missing database configuration. Please check the environment variables."
//     );
//     process.exit(1);
// }

export const db = mysql.createPool({
    host: sqlDb.host,
    user: sqlDb.user,
    password: sqlDb.password,
    database: sqlDb.database,
});

// Test the database connection
(async () => {
    try {
        await db.getConnection();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
})();
