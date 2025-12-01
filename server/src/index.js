import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Client } from "pg";

export const pool = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "hacking",
});

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//     console.error("DATABASE_URL is required");
//     process.exit(1);
// }

// const pool = new Pool({ connectionString });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/insecure/:search?", async (req, res) => {
    const search = req.params.search || "";
    console.log(search);

    try {
        const result = await pool.query(search);

        return res.json({
            data: result.rows,
            sql: search,
        });
    } catch (err) {
        return res.status(500).json({
            error: "query_failed",
            message:
                "Database query failed. The SQL syntax was invalid or a restricted command was attempted.",
            sql: search,
        });
    }
});

app.get("/api/secure/:search?", async (req, res) => {
    const search = req.params.search || "";
    const pattern = `%${search}%`;

    const sqlTemplate = `SELECT id, username, email FROM users WHERE username ILIKE $1`;
    const values = [pattern];

    console.log(`[SECURE] SQL Template: ${sqlTemplate}`);
    console.log(`[SECURE] Parameter Value: ${values}`);

    try {
        const result = await pool.query(sqlTemplate, values);

        const presentationSql = `${sqlTemplate.replace(
            "$1",
            `'${pattern.replace(/'/g, "''")}'`
        )} \n-- Note: Input was treated as literal text (data), not executable SQL (code).`;

        return res.json({
            data: result.rows,
            sql: presentationSql,
        });
    } catch (err) {
        console.error("[SECURE] SQL Execution Failed:", err.message);
        // This catch block should only be hit if the SQL query template itself is wrong
        return res.status(500).json({
            error: "query_failed",
            message: "A genuine server error occurred.",
        });
    }
});

const PORT = process.env.PORT || 4000;
async function start() {
    try {
        await pool.connect();
    } catch (err) {
        if (err && err.code === "3D000") {
            const admin = new Client({
                host: "localhost",
                port: 5432,
                user: "postgres",
                password: process.env.POSTGRES_PASSWORD,
                database: "postgres",
            });
            await admin.connect();
            await admin.query('CREATE DATABASE "Hacking"');
            await admin.end();
            await pool.connect();
        } else {
            throw err;
        }
    }
    // await initDb();
    app.listen(PORT, () => {
        console.log(`server listening on ${PORT}`);
    });
}
start().catch((err) => {
    console.error("failed to start server", err);
    process.exit(1);
});
