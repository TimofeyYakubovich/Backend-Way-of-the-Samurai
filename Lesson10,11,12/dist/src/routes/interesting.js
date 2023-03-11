"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingRouter = void 0;
const express_1 = __importDefault(require("express"));
const courses_1 = require("./courses");
const getInterestingRouter = (db) => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
        }
        res.json(foundCourses.map(courses_1.getCourseViewModel));
    });
    router.get('/:id(\\d*)', (req, res) => {
        // res.json({title: 'data by id: ' + req.params.id})
        res.json({ title: 'data by id:' });
        // res.sendStatus(HTTP_STATUSES.OK_200)
    });
    router.get('/books', (req, res) => {
        // res.setHeader("Content-Security-Policy-Report-Only", "default-src: 'self'")
        // res.setHeader("Content-Security-Policy:" "default-src 'self'" "script-src 'self' 'unsafe-inline'")
        res.json({ title: 'it\'s books handler' });
    });
    return router;
};
exports.getInterestingRouter = getInterestingRouter;
