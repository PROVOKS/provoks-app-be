export function getPagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));
  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number,
) {
  return {
    items,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    },
  };
}
