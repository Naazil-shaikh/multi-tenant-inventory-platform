import { ApiError } from "./ApiError.js";

export const getPaginationParams = (query, options = {}) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100,
    allowedSorts = [],
    defaultSort = "-createdAt",
  } = options;

  // page
  let page = parseInt(query.page, 10);
  if (isNaN(page) || page < 1) page = defaultPage;

  // limit
  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  // sort (WHITELISTED)
  let sort = defaultSort;

  if (query.sort) {
    const isDesc = query.sort.startsWith("-");
    const field = query.sort.replace("-", "");

    if (!allowedSorts.includes(field)) {
      throw new ApiError(
        400,
        `Invalid sort field. Allowed: ${allowedSorts.join(", ")}`
      );
    }

    sort = `${isDesc ? "-" : ""}${field}`;
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
  };
};
