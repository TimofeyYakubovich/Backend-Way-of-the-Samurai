"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesRouter = exports.getCourseViewModel = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const getCourseViewModel = (dbCourse) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    };
};
exports.getCourseViewModel = getCourseViewModel;
// export const addCoursesRoutes = (app: Express) => {
const getCoursesRouter = (db) => {
    const coursesRouter = express_1.default.Router(); // создаем Router называем его coursesRouter заменяем во всех эндпоинтах app на coursesRouter
    // app.get('/courses', (req: Request<{}, {}, {}, {title: string}>, 
    // app.get('/courses', (req: RequestWithQuery<{title: string}>,
    // app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModal>,
    coursesRouter.get('/', (req, 
    // res: Response<CourseType[]>) => { 
    res) => {
        // говорим что у Request мы хотим уточнить 
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
        }
        // res.json(foundCourses);
        // res.json(foundCourses.map(dbCourse => {
        //     return {
        //         id: dbCourse.id,
        //         title: dbCourse.title
        //     }
        // }));
        res.json(foundCourses.map(exports.getCourseViewModel)); // getCourseViewModel будет вызываться спомощью map для каждого объекта и возврощать 
        // нужный объект
    });
    // app.get('/courses/:id', (req: Request<{id: string}>, res) => { 
    // app.get('/courses/:id', (req: RequestWithParams<{id: string}>, res: Response<CourseViewModel>) => { 
    // app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => { 
    coursesRouter.get('/:id', (req, res) => {
        const FoundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!FoundCourse) { // Как правило, с массивами так не делается
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        // res.json(FoundCourse) 
        // res.json({
        //     id: FoundCourse.id,
        //     title: FoundCourse.title
        // }) 
        res.json((0, exports.getCourseViewModel)(FoundCourse));
    });
    // app.post('/courses', (req: Request<{},{},{title: string}>, 
    // app.post('/courses', (req: RequestWithBody<{title: string}>,
    // app.post('/courses', (req: RequestWithBody<CourseCreateModel>,
    coursesRouter.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createdCourse = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(createdCourse);
        console.log(createdCourse);
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            // .json(createdCourse)
            // .json({
            //     id: createdCourse.id,
            //     title: createdCourse.title
            // })
            .json((0, exports.getCourseViewModel)(createdCourse));
    });
    // app.delete('/courses/:id', (req: Request<{id: string}>, res) => {
    // app.delete('/courses/:id', (req: RequestWithParams<{id: string}>, res) => {
    // app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    coursesRouter.delete('/:id', (req, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        // res.sendStatus(204) 
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    // app.put('/courses/:id', (req: Request<{id: string},{},{title: string}>, res) => { 
    // app.put('/courses/:id', (req: RequestWithParamsAndBody<{id: string},{title: string}>, res) => { 
    // app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,CourseUpdateModel>, res) => { 
    coursesRouter.put('/:id', (req, res) => {
        if (!req.body.title) {
            // res.sendStatus(400)
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const FoundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!FoundCourse) {
            // res.sendStatus(404);
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        FoundCourse.title = req.body.title;
        // res.sendStatus(204) 
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    return coursesRouter; // после создания и кофигурации Router возвращаем его из функции getCoursesRoutes
};
exports.getCoursesRouter = getCoursesRouter;
