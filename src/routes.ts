import { Express } from "express";

export default function (app: Express) {
    app.get("/", (req, res) => res.sendStatus(200));
}