import express from "express";
import { RequestWithBody, RequestWithParams, RequestWithQuery, RequestWithParamsAndBody } from "../types";
import { GetCoursesQueryModal } from "../models/GetCoursesQueryModal";
import { CourseViewModel } from "../models/CourseViewModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { CourseCreateModel } from "../models/CourseCreateModel";
import { CourseUpdateModel } from "../models/CourseUpdateModal";
import { Response, Express } from "express";
import { CourseType, DBType } from "../db/db";
import { HTTP_STATUSES } from "../utils";

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

// export const addCoursesRoutes = (app: Express) => {
export const getCoursesRouter = (db: DBType) => {   // app уже сдесь не нужен переименовываем addCoursesRoutes в getCoursesRoutes

    const coursesRouter = express.Router() // создаем Router называем его coursesRouter заменяем во всех эндпоинтах app на coursesRouter

    // app.get('/courses', (req: Request<{}, {}, {}, {title: string}>, 
    // app.get('/courses', (req: RequestWithQuery<{title: string}>,
    // app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModal>,
    coursesRouter.get('/', (req: RequestWithQuery<GetCoursesQueryModal>,
        // res: Response<CourseType[]>) => { 
            res: Response<CourseViewModel[]>) => { 
        // говорим что у Request мы хотим уточнить 
        let foundCourses = db.courses;

        if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
        }

        // res.json(foundCourses);
        // res.json(foundCourses.map(dbCourse => {
        //     return {
        //         id: dbCourse.id,
        //         title: dbCourse.title
        //     }
        // }));
        res.json(foundCourses.map(getCourseViewModel)); // getCourseViewModel будет вызываться спомощью map для каждого объекта и возврощать 
        // нужный объект
    })

    // app.get('/courses/:id', (req: Request<{id: string}>, res) => { 
    // app.get('/courses/:id', (req: RequestWithParams<{id: string}>, res: Response<CourseViewModel>) => { 
    // app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => { 
    coursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {

        const FoundCourse = db.courses.find(c => c.id === +req.params.id) 

        if (!FoundCourse) {  // Как правило, с массивами так не делается
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
        }

        // res.json(FoundCourse) 
        // res.json({
        //     id: FoundCourse.id,
        //     title: FoundCourse.title
        // }) 
        res.json(getCourseViewModel(FoundCourse)) 
    })

    // app.post('/courses', (req: Request<{},{},{title: string}>, 
    // app.post('/courses', (req: RequestWithBody<{title: string}>,
    // app.post('/courses', (req: RequestWithBody<CourseCreateModel>,
    coursesRouter.post('/', (req: RequestWithBody<CourseCreateModel>,
        res: Response<CourseViewModel>) => {

        if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
        }

        const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
        }

        db.courses.push(createdCourse)

        console.log(createdCourse)
        res
        .status(HTTP_STATUSES.CREATED_201)
        // .json(createdCourse)
        // .json({
        //     id: createdCourse.id,
        //     title: createdCourse.title
        // })
        .json(getCourseViewModel(createdCourse))
    })

    // app.delete('/courses/:id', (req: Request<{id: string}>, res) => {
    // app.delete('/courses/:id', (req: RequestWithParams<{id: string}>, res) => {
    // app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    coursesRouter.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {

        db.courses = db.courses.filter(c => c.id !== +req.params.id) 

        // res.sendStatus(204) 
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) 
    })

    // app.put('/courses/:id', (req: Request<{id: string},{},{title: string}>, res) => { 
    // app.put('/courses/:id', (req: RequestWithParamsAndBody<{id: string},{title: string}>, res) => { 
    // app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,CourseUpdateModel>, res) => { 
    coursesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,CourseUpdateModel>, res) => {

        if (!req.body.title) {
        // res.sendStatus(400)
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
        }

        const FoundCourse = db.courses.find(c => c.id === +req.params.id) 

        if (!FoundCourse) {
        // res.sendStatus(404);
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
        }

        FoundCourse.title = req.body.title;

        // res.sendStatus(204) 
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) 
    })

    return coursesRouter; // после создания и кофигурации Router возвращаем его из функции getCoursesRoutes
}

