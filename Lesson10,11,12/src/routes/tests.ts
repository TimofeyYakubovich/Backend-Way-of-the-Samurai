import express, { Express } from "express";
import { HTTP_STATUSES } from "../utils";
import { DBType } from "../db/db";

// export const addTestsRoutes = (app: Express, db: DBType) => {
export const getTestsRouter = (db: DBType) => {

    const router = express.Router()

    // app.delete('/__test__/data', (req, res) => {
    router.delete('/data', (req, res) => {
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

    return router;
}