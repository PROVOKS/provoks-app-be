import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type Schemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

/**
 * Express 5 membuat `req.query` & `req.params` menjadi getter-only,
 * jadi hasil parse disimpan di properti terpisah (`req.validated*`).
 * `req.body` masih bisa di-assign langsung.
 */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params) as Record<
          string,
          string
        >;
      }
      if (schemas.query) {
        req.validatedQuery = schemas.query.parse(req.query) as Record<
          string,
          unknown
        >;
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
