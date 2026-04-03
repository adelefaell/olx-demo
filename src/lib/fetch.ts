// Unified fetch wrapper used by every API call in the app.
// Handles: JSON parsing, error normalisation, and common headers.

export class ApiError extends Error {
  constructor(
    public status: number,
    public url: string,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface FetchOptions {
  method?: "GET" | "POST"
  headers?: Record<string, string>
  body?: string
}

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body,
  })

  if (!res.ok) {
    throw new ApiError(
      res.status,
      url,
      `Request failed: ${res.status} ${res.statusText}`,
    )
  }

  return res.json() as Promise<T>
}

export async function apiFetchNdjson<T>(
  url: string,
  body: string,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  return apiFetch<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-ndjson", ...extraHeaders },
    body,
  })
}
