export type WithOptional<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExp: "1h",
    port: process.env.PORT || 3000,
    apiKey: process.env.API_KEY,
    env: process.env.NODE_ENV || "development",
};
