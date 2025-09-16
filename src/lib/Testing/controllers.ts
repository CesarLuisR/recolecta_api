import { RequestHandler } from "express";
import { pool } from "../../database";

export const resetDBCtrl: RequestHandler = async (req, res) => {
    try {
        await pool.query(`
            TRUNCATE TABLE 
            usuarios
            RESTART IDENTITY CASCADE
        `);
        res.status(200).send({ ok: true });
    } catch (e: any) {
        res.status(500).send({ error: e.message });
    }
};

export const expireMagicLink: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE magic_links SET expira_en = NOW() - INTERVAL '1 minute' WHERE id = $1", [id]);
        res.status(200).send({ ok: true });
    } catch (e: any) {
        res.status(500).send({ error: e.message });
    }
};

export const useMagicLink: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE magic_links SET used = TRUE WHERE id = $1", [id]);
        res.status(200).send({ ok: true });
    } catch (e: any) {
        res.status(500).send({ error: e.message });
    }
};