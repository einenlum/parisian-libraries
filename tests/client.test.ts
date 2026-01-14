import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { request } from '../src/client.js';

const mockFetch = jest.fn<typeof fetch>();

describe('client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('request', () => {
    it('should make a POST request with JSON body', async () => {
      const mockResponse = {
        success: true,
        message: null,
        errors: [],
        d: { result: 'test' },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await request('POST', 'https://example.com/api', {
        foo: 'bar',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://bibliotheques.paris.fr',
          'Referer': 'https://bibliotheques.paris.fr/',
        },
        body: JSON.stringify({ foo: 'bar' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make a GET request with query parameters', async () => {
      const mockResponse = {
        success: true,
        message: null,
        errors: [],
        d: { result: 'test' },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await request('GET', 'https://example.com/api', {
        foo: 'bar',
        baz: 'qux',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api?foo=bar&baz=qux',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://bibliotheques.paris.fr',
            'Referer': 'https://bibliotheques.paris.fr/',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when response is not successful', async () => {
      const mockResponse = {
        success: false,
        message: 'Something went wrong',
        errors: ['Error 1', 'Error 2'],
        d: null,
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await expect(
        request('POST', 'https://example.com/api', { foo: 'bar' })
      ).rejects.toThrow('Something went wrong Error 1, Error 2');
    });
  });
});
