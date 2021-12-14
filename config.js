export default {
    mongoURI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eDEF",
    PORT: process.env.PORT || 3000,
    JWT_SECRET: "2e49ba87f494618f11e685307db3793969aa47bb17c41cd1feef0348cf03638b29bc2a",
    JWT_TIMEOUT: 86400,
    fileStorage: "./upload"
}
