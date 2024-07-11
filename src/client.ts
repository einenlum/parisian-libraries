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
    throw new Error(response.message + ' ' + response.errors.join(', '));
  }
}
