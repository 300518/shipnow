const { DatosInvalidosError } = require("../errors");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePagination(query = {}) {
  const page = query.page === undefined
    ? DEFAULT_PAGE
    : Number(query.page);

  const limit = query.limit === undefined
    ? DEFAULT_LIMIT
    : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw new DatosInvalidosError({
      parametro: "page",
      valor: query.page,
      mensaje: "El parámetro page debe ser un entero mayor o igual a 1.",
    });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new DatosInvalidosError({
      parametro: "limit",
      valor: query.limit,
      mensaje: `El parámetro limit debe ser un entero entre 1 y ${MAX_LIMIT}.`,
    });
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  };
}

module.exports = {
  parsePagination,
  buildPagination,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
