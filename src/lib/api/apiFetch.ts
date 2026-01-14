/**
 * apiFetch
 * -------------------------------------------------------
 * A client-side wrapper around fetch() for your Next.js app.
 *
 *  * Key features:
 * - Accepts plain object bodies and automatically JSON.stringify() them
 * - Accepts strings, FormData, Blob, etc. as-is
 * - Merges default and custom headers
 * - Handles errors safely and parses JSON responses
 *
 * Responsibilities:
 * - Automatically serialize body objects to JSON
 * - Set default headers (`Content-Type: application/json`)
 * - Merge any user-specified headers
 * - Handle errors and parse JSON safely
 *
 * Parameters:
 * - input: RequestInfo
 *     The URL string or Request object to fetch.
 * - init: RequestInit (optional)
 *     Options like method, headers, body, etc. Defaults to {}.
 *
 * Returns:
 * - Parsed JSON response from the server
 *
 * Throws:
 * - An Error with a server-provided message if response is not ok
 * -------------------------------------------------------
 */


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiFetchBody = Record<string, any> | string | null;

interface ApiFetchInit extends Omit<RequestInit, 'body'> {
  body?: ApiFetchBody; // Accept plain objects, strings, or null
  headers?: Record<string, string>;
}

export async function apiFetch(input: RequestInfo, init: ApiFetchInit = {}) {
  const { body, headers, ...rest } = init;

  // If body is object, serialize to JSON otherwise leave as is
  const requestBody =
    body && typeof body !== 'string' ? JSON.stringify(body) : body;

  // Merge default and user-specified headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const res = await fetch(input, {
    ...rest, // method, credentials, mode, etc.
    headers: requestHeaders,
    body: requestBody,
  });

  if (!res.ok) {
    // Attempt to parse the response as JSON
    // If parsing fails (empty body, invalid JSON), catch the error and return an empty object
    const errorData = await res.json().catch(() => ({}));

    // Throw a new error using the server-provided message if available,
    // otherwise fallback to a default error message
    throw new Error(errorData?.message ?? 'API request failed');
  }

  // Response is OK, try to parse JSON
  try {
    return await res.json();
  } catch {
    // If parsing fails (empty or invalid JSON), return null
    return null;
  }
}
