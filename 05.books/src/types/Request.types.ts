import { Request } from "express";

export type TypedRequestParams<T> = Request<T>;

export type TypedRequestBody<T> = Request<void, void, T>;

export type TypedRequestParamsBody<Params, Body> = Request<Params, void, Body>;
