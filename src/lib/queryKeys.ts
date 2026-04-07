export const queryKeys = {
  events: {
    all: () => ["events"] as const,
    upcoming: (params?: { limit?: number; offset?: number }) =>
      ["events", "upcoming", params] as const,
    past: (params?: { limit?: number; offset?: number }) =>
      ["events", "past", params] as const,
    detail: (id: string) => ["events", "detail", id] as const,
  },
  journals: {
    all: () => ["journals"] as const,
    list: (params?: { limit?: number; offset?: number }) =>
      ["journals", "list", params] as const,
    detail: (id: string) => ["journals", "detail", id] as const,
  },
  podcasts: {
    all: () => ["podcasts"] as const,
    list: (params?: { limit?: number; offset?: number }) =>
      ["podcasts", "list", params] as const,
    detail: (id: string) => ["podcasts", "detail", id] as const,
  },
  articles: {
    all: () => ["articles"] as const,
    list: (params?: { limit?: number; offset?: number }) =>
      ["articles", "list", params] as const,
    detail: (id: string) => ["articles", "detail", id] as const,
  },
  latestFeed: {
    all: () => ["latestFeed"] as const,
  },
  audience: {
    detail: (name: string) => ["audience", name] as const,
    events: (name: string, params?: { limit?: number; offset?: number }) =>
      ["audience", name, "events", params] as const,
    articles: (name: string, params?: { limit?: number; offset?: number }) =>
      ["audience", name, "articles", params] as const,
    podcasts: (name: string, params?: { limit?: number; offset?: number }) =>
      ["audience", name, "podcasts", params] as const,
  },
};
