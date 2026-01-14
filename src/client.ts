import { CallResult } from './types/api.js';

export async function request<T>(
  method: 'POST' | 'GET',
  url: string,
  data: null | Object
): Promise<CallResult<T>> {
  const fetchParameters = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'https://bibliotheques.paris.fr',
      'Referer': 'https://bibliotheques.paris.fr/',
    },
  };

  if (method === 'GET') {
    const searchParams = new URLSearchParams(data as Record<string, string>);
    url = `${url}?${searchParams.toString()}`;
  } else {
    fetchParameters['body'] = JSON.stringify(data);
  }

  const response = await fetch(url, fetchParameters);

  const responseBody = (await response.json()) as CallResult<T>;
  checkResponse(responseBody);

  return responseBody;
}

function checkResponse(response: CallResult<any>) {
  if (!response.success) {
    const errorDetails = response.errors
      ?.map(e => typeof e === 'string' ? e : JSON.stringify(e))
      .join(', ') ?? '';
    throw new Error(response.message + ' ' + errorDetails);
  }
}
