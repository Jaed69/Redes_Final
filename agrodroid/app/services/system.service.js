const pool = require("../config/db");

const estadoSistema = async () => {
    let dbOk = false;
    try {
        await pool.query("SELECT 1");
        dbOk = true;
    } catch (_) {
        dbOk = false;
    }

    const envFlags = {
        POSTGRES_DB: process.env.POSTGRES_DB ? "set" : "unset",
        DB_HOST: process.env.DB_HOST ? "set" : "unset",
        DB_PORT: process.env.DB_PORT ? "set" : "unset",
        DB_USER: process.env.DB_USER ? "set" : "unset",
        DB_NAME: process.env.DB_NAME ? "set" : "unset",
        JWT_SECRET: process.env.JWT_SECRET ? "set" : "unset"
    };

    return {
        db: dbOk ? "ok" : "error",
        env: envFlags,
        timestamp: new Date().toISOString()
    };
};

module.exports = { estadoSistema };