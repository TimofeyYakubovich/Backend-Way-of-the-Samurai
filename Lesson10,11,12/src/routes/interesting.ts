import express from "express";
import { RequestWithParams, RequestWithQuery } from "../types";
import { GetCoursesQueryModal } from "../models/GetCoursesQueryModal";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { DBType } from "../db/db";
import { getCourseViewModel } from "./courses";
import { Response, Express } from "express";
import { CourseViewModel } from "../models/CourseViewModel";
import { HTTP_STATUSES } from "../utils";

export const getInterestingRouter = (db: DBType) => {

    const router = express.Router()

    router.get('/', (req: RequestWithQuery<GetCoursesQueryModal>,
        res: Response<CourseViewModel[]>) => {

            let foundCourses = db.courses;

            if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
            }
    
            res.json(foundCourses.map(getCourseViewModel));
    })

    router.get('/:id(\\d*)', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {

        // res.json({title: 'data by id: ' + req.params.id})
        res.json({title: 'data by id:'})
        // res.sendStatus(HTTP_STATUSES.OK_200)
    })

    router.get('/books', (req: RequestWithQuery<GetCoursesQueryModal>,
        res) => {
        // res.setHeader("Content-Security-Policy-Report-Only", "default-src: 'self'")
        // res.setHeader("Content-Security-Policy:" "default-src 'self'" "script-src 'self' 'unsafe-inline'")
            res.json({title: 'it\'s books handler'})
    })

    

    

    

    return router;
}