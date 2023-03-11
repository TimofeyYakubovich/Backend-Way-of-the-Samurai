// в файлик types.ts закинем некаторые вспомогательные типы
// определим свои дженерики
// Дженерики, или Generic Types, — обобщенные типы. Они нужны для описания похожих, но отличающихся какими-то характеристиками типов.
import { Request } from "express";

export type RequestWithBody<T> = Request<{},{}, T>  // тот же Request из express но в нем зарание прописаны дженерики
export type RequestWithQuery<T> = Request<{},{},{}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T,{},B>