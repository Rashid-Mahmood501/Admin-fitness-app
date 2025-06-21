export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchWrapperOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  isFormData?: boolean;
}

export async function fetchWrapper<T = any>(
  url: string,
  options: FetchWrapperOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, isFormData = false } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`http://localhost:3000${url}`, fetchOptions);

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMessage = isJson && data?.error ? data.error : res.statusText;
    throw new Error(errorMessage || "Request failed");
  }

  return data;
}
