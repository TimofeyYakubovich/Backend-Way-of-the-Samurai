// Lesson 11 Типизация 
// типизация request и response 

// JS очень динамический язык и строгой типизации в нем нет и соответственно что мы можем плучить что мы можем вернуть надо контролировать
// TypeScript и является этим надомножеством типов для контрля самих себя
// пртипизируем реквесты и респонсы

// так как 2 аргумент колбек функция катороая передается в get TypeScript думает что req это что то явное 
// у req есть обекты query, body, URI параметры params и они все содержат ключ значение в которых можно ошибится 
// у объекта req есть свойство res req.res через каторое можно тоже что то отправлять это тот же самый объект ссылочно
 
// протипизируем req явно объектом Request каторый лежит в экспрессе import express, {Request, Response} from "express"
// говорим что у Request мы хотим уточнить момжно уточнить interface Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs, Locals extends Record<string, any> = Record<string, any>>

// app.get('/courses',
// момжно уточнить 
// P = core.ParamsDictionary  URI параметры сейчас не используем поэтому оставляем пустой объект
// ResBody то что будем возвращать но этот ResBody относится к тому объекту res каторый внутри req поэтому оставляем пустой объект
// ReqBody то что прилитает в body с запросом в get запросе никакой body не прилеает поэтому оставляем пустой объект
// ReqQuery query параметры каторые прилетают вместе с get запросом поэтому оставляем объект {title: string}
// Locals специальный объект объект помойка
// Request<{}, {}, {}, {title: string}

// типизируем res
// момжно уточнить 
// ResBody мы возвращаем массив foundCourses сначала типизируем courses CourseType теперь можно сказать что в качестве респнса мы возвращаем 
// массив CourseType[]
// Locals

// app.get('/courses/:id' на запрос сдесь только URI параметр нету Body есть res
// P req: Request<{id: string} id пишем string потому что она передается как строка
// бльше ничего не передаем потому что ничего и нет

// app.post('/courses'
// req: Request<{},{},{title: string} типизируем только ReqBody
// res:  Response<CourseType> потому что посути возвращает такой же массив courses типизируем его как CourseType

// app.delete('/courses/:id'
// req: Request<{id: string}

// app.put('/courses/:id', (req: Request<{id: string},{},{title: string}>

// в файлик types.ts закинем некаторые вспомогательные типы Дженерики

// объекты {id: string} {title: string} выжный элимент взаимодействия между клиентом и сервером то что на бекенд должны прислать в каком виде
// и поэтому их фиксируют в одельных файлах
// в папке models создадим файлы для  ReqBody  ReqQuery
// Для id URI параметров не будем делать отдельный тип

// на выходе у нас тип CourseType каторый характеризует базу данных
// нам над что бы db находилась отдельно то что находится в базе данных не должно относится к тому что возврощается на клиент
// для этого создадми в папке models еше один файл CourseViewModel

// допустим в каждый объект базы данных нужно добавить еще 1 ключ значение studentCount и в CourseType добавим тоже studentsCount
// и плучатся то что CourseType больше чем CourseViewModel и там где мы указали на выходе CourseViewModel
// и если щас сделать get запрос на '/courses' то найдутся все курсы courses и вернуться поитогу все курсы 
// и даже если мы поставил на выходе res: Response<CourseViewModel[]> где нет studentsCount то все равно ответ вернется вместе с studentsCount
// потому что у courses стоит тип CourseType
// поэтому запросив данныу у базы данных let foundCourses = db.courses; мы не должны эти же данные отправлять клиенту
// а использовать метод map и через него отправлять только те данные каторые нужны клиенту без studentsCount

// JSDoc - Генератор документации в HTML-формате из комментариев исходного кода на JavaScript

// типы можно использовать и при тестах 

// в экспресе есть готовый инструмент для этого класс Router expres.Router
// когда вызывается expres.Router создается экземпляр класса и мы уже потом его кофигурируем

import express from "express"
export const app = express()
const helmet = require("helmet");
// import { addCoursesRoutes } from "./routes/courses"
import { getCoursesRouter } from "./routes/courses"
import { getInterestingRouter } from "./routes/interesting"
// import { addTestsRoutes } from "./routes/tests"
import { getTestsRouter } from "./routes/tests"
import { db } from "./db/db"


app.use(helmet());
const jsonBodyMiddleware = express.json() // Создадим этот промежуточный слой jsonBodyMiddleware путём вызова метода JSON у объекта Express
app.use(jsonBodyMiddleware) // скажем нашему приложению использовать его, прежде чем отправлять request в обработчики


app.use("/courses", getCoursesRouter(db))
app.use("/interesting", getInterestingRouter(db))
// addCoursesRoutes(app);
// const coursesRouter = getCoursesRouter(db);
// app.use("/courses", coursesRouter) // переаем запрос каторый летит на /courses coursesRouter и теперь можно в каждом эндпоинте удалить courses
// из URL


// addTestsRoutes(app, db)
// const TestRouter = getTestsRouter(db)
// app.use("/__test__", TestRouter)
app.use("/__test__", getTestsRouter(db))


