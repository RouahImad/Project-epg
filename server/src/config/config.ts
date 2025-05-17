export type WithOptional<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    port: process.env.PORT || 3000,
    apiKey: process.env.API_KEY,
};
