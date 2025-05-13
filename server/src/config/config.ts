import mysql from "mysql2/promise";

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    port: process.env.PORT || 3000,
    sqlDb: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    apiKey: process.env.API_KEY,
};

export const db = mysql.createPool({
    host: config.sqlDb.host,
    user: config.sqlDb.user,
    password: config.sqlDb.password,
    database: config.sqlDb.database,
});

// Test the database connection
(async () => {
    try {
        await db.getConnection();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
        throw error;
    }
})();
