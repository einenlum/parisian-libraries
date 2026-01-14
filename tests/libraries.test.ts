import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  searchAuthors,
  searchBooksFromAuthor,
  getBookAvailability,
  getLibraryAddress,
} from '../src/libraries.js';

const mockFetch = jest.fn<typeof fetch>();

describe('libraries', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('searchAuthors', () => {
    it('should search for authors and return cleaned results', async () => {
      const mockApiResponse = {
        success: true,
        message: null,
        errors: [],
        d: [
          { id: '123', label: 'Victor Hugo', query: 'query1', value: 'value1' },
          { id: '456', label: 'Victor Hugues', query: 'query2', value: 'value2' },
        ],
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      const result = await searchAuthors('Victor');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bibliotheques.paris.fr/default/Portal/Search.svc/Suggest',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://bibliotheques.paris.fr',
            'Referer': 'https://bibliotheques.paris.fr/',
          },
        })
      );

      expect(result).toEqual([
        { id: '123', label: 'Victor Hugo' },
        { id: '456', label: 'Victor Hugues' },
      ]);
    });

    it('should return empty array when no authors found', async () => {
      const mockApiResponse = {
        success: true,
        message: null,
        errors: [],
        d: [],
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      const result = await searchAuthors('NonExistentAuthor');

      expect(result).toEqual([]);
    });
  });

  describe('searchBooksFromAuthor', () => {
    it('should search books from an author and return cleaned results', async () => {
      const mockApiResponse = {
        success: true,
        message: null,
        errors: [],
        d: {
          SearchInfo: {
            Page: 0,
            PageMax: 5,
          },
          Results: [
            {
              FriendlyUrl: '/book/123',
              Resource: {
                Crtr: 'Victor Hugo',
                Desc: 'A great novel',
                Id: 'book-123',
                Pbls: 'Gallimard',
                Ttl: 'Les Miserables',
                RscId: 'rsc-123',
                RscBase: 'SYRACUSE',
              },
            },
            {
              FriendlyUrl: '/book/456',
              Resource: {
                Crtr: 'Victor Hugo',
                Desc: 'Another great novel',
                Id: 'book-456',
                Pbls: 'Folio',
                Ttl: 'Notre-Dame de Paris',
                RscId: 'rsc-456',
                RscBase: 'SYRACUSE',
              },
            },
            {
              FriendlyUrl: '/book/789',
              Resource: {
                Crtr: 'Victor Hugo',
                Desc: 'E-book version',
                Id: 'book-789',
                Pbls: 'Digital',
                Ttl: 'Les Miserables (e-book)',
                RscId: 'rsc-789',
                RscBase: 'DILICOM',
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      const result = await searchBooksFromAuthor('author-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bibliotheques.paris.fr/Default/Portal/Recherche/Search.svc/Search',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://bibliotheques.paris.fr',
            'Referer': 'https://bibliotheques.paris.fr/',
          },
        })
      );

      // DILICOM (e-books) should be filtered out - only physical books returned
      expect(result).toEqual({
        page: 0,
        pageMax: 5,
        results: [
          {
            url: '/book/123',
            title: 'Les Miserables',
            description: 'A great novel',
            id: 'book-123',
            publisher: 'Gallimard',
            rscId: 'rsc-123',
            docbase: 'SYRACUSE',
          },
          {
            url: '/book/456',
            title: 'Notre-Dame de Paris',
            description: 'Another great novel',
            id: 'book-456',
            publisher: 'Folio',
            rscId: 'rsc-456',
            docbase: 'SYRACUSE',
          },
        ],
      });
    });
  });

  describe('getBookAvailability', () => {
    it('should get book availability with library information', async () => {
      const mockApiResponse = {
        success: true,
        message: null,
        errors: [],
        d: {
          HoldingColumns: [],
          Holdings: [
            {
              Cote: 'R HUG',
              HoldingId: 'hold-123',
              IsAvailable: true,
              IsLoanable: true,
              Other: [
                { Key: 'SiteLabel', Value: '75001 - La Canopee' },
                {
                  Key: 'SiteLabelLink',
                  Value: 'https://www.paris.fr/lieux/mediatheque-de-la-canopee-16634',
                },
              ],
              Section: 'Adult Fiction',
              Site: 'CANOPEE',
              Statut: 'En rayon',
              Type: 'Book',
              WhenBack: null,
            },
            {
              Cote: 'R HUG',
              HoldingId: 'hold-456',
              IsAvailable: false,
              IsLoanable: true,
              Other: [
                { Key: 'SiteLabel', Value: '75004 - Bibliotheque Historique' },
                {
                  Key: 'SiteLabelLink',
                  Value: 'https://www.paris.fr/lieux/bibliotheque-historique-123',
                },
              ],
              Section: 'Adult Fiction',
              Site: 'BHVP',
              Statut: 'En pret',
              Type: 'Book',
              WhenBack: '25/12/2024',
            },
          ],
          fieldList: {
            Identifier: ['ID-123'],
            Title: ['Les Miserables'],
            Author_sort: ['Hugo, Victor'],
            YearOfPublication_sort: ['1862'],
            Isbn: ['978-2-07-040850-4'],
            Ean: ['9782070408504'],
            TypeOfDocument: ['Livre'],
            ThumbSmall: ['https://example.com/small.jpg'],
            ThumbMedium: ['https://example.com/medium.jpg'],
            ThumbLarge: ['https://example.com/large.jpg'],
            Isbn10: ['2070408507'],
          },
        },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse),
      } as Response);

      const result = await getBookAvailability('rsc-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bibliotheques.paris.fr/default/Portal/Services/ILSClient.svc/GetHoldings',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://bibliotheques.paris.fr',
            'Referer': 'https://bibliotheques.paris.fr/',
          },
        })
      );

      expect(result.identifier).toBe('ID-123');
      expect(result.title).toBe('Les Miserables');
      expect(result.authorName).toBe('Hugo, Victor');
      expect(result.yearOfPublication).toBe(1862);
      expect(result.isbn).toBe('978-2-07-040850-4');
      expect(result.libraries).toHaveLength(2);

      expect(result.libraries[0]).toMatchObject({
        cote: 'R HUG',
        holdingId: 'hold-123',
        isAvailable: true,
        isLoanable: true,
        name: '75001 - La Canopee',
        url: 'https://www.paris.fr/lieux/mediatheque-de-la-canopee-16634',
        whenBack: null,
      });

      expect(result.libraries[1]).toMatchObject({
        cote: 'R HUG',
        holdingId: 'hold-456',
        isAvailable: false,
        isLoanable: true,
        name: '75004 - Bibliotheque Historique',
      });
      expect(result.libraries[1].whenBack).toBeInstanceOf(Date);
    });
  });

  describe('getLibraryAddress', () => {
    it('should extract address from HTML page', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
        <body>
          <div class="sidebar-section is-place">
            <div class="sidebar-section-content">
              <strong>Address:</strong>
              10 Rue de Rivoli
              75004 Paris
            </div>
          </div>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockHtml),
      } as Response);

      const result = await getLibraryAddress(
        'https://www.paris.fr/lieux/mediatheque-123'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.paris.fr/lieux/mediatheque-123'
      );
      expect(result).toContain('10 Rue de Rivoli');
      expect(result).toContain('75004 Paris');
    });

    it('should return null when address section is not found', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
        <body>
          <div class="other-section">
            <p>No address here</p>
          </div>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockHtml),
      } as Response);

      const result = await getLibraryAddress(
        'https://www.paris.fr/lieux/unknown-123'
      );

      expect(result).toBeNull();
    });
  });
});
