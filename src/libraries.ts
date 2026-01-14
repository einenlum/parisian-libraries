import { parse } from 'date-fns';
import { parse as parseHtml } from 'node-html-parser';

import { request } from './client.js';
import {
  CleanedOutput as AuthorSearchCleanedOutput,
  Input as AuthorSearchInput,
  Output as AuthorSearchOutput,
} from './types/author_search.js';
import {
  Input as BooksFromAuthorInput,
  Output as BooksFromAuthorOutput,
  CleanedOutput as BooksFromAuthorCleanedOutput,
} from './types/books_from_author_search.js';
import {
  Input as BookAvailabilityInput,
  Output as BookAvailabilityOutput,
  CleanedOutput as BookAvailabilityCleanedOutput,
} from './types/book_availability.js';

export async function searchAuthors(authorName: string) {
  const url =
    'https://bibliotheques.paris.fr/default/Portal/Search.svc/Suggest';

  const body: AuthorSearchInput.AuthorSearch = {
    term: authorName,
    fieldUid: 464,
    scenarioCode: 'CATALOGUE',
  };

  const response = await request<
    AuthorSearchCleanedOutput.AuthorSearchElement[]
  >('POST', url, body);

  return response.d.map((author: AuthorSearchOutput.AuthorSearchElement) => {
    return {
      id: author.id,
      label: author.label,
    };
  });
}

export async function searchBooksFromAuthor(authorId: string) {
  const url =
    'https://bibliotheques.paris.fr/Default/Portal/Recherche/Search.svc/Search';

  const data: BooksFromAuthorInput.SearchBooksFromAuthor = {
    query: {
      Page: 0,
      PageRange: 10,
      ResultSize: 100,
      ScenarioCode: 'CATALOGUE',
      Grid: JSON.stringify({ '464': [authorId] }),
    },
  };

  const response = await request<BooksFromAuthorOutput.BooksFromAuthorResponse>(
    'POST',
    url,
    data
  );

  const results = response.d.Results;

  // Exclude digital books (DILICOM = e-books) - this library is for physical books only
  const physicalResults = results.filter(
    (result) => result.Resource.RscBase !== 'DILICOM'
  );

  const cleanedResults = physicalResults.map((result) => {
    return {
      url: result.FriendlyUrl,
      title: result.Resource.Ttl,
      description: result.Resource.Desc,
      publisher: result.Resource.Pbls,
      id: result.Resource.Id,
      rscId: result.Resource.RscId,
      docbase: result.Resource.RscBase,
    } as BooksFromAuthorCleanedOutput.BookFromAuthorResultItem;
  });

  return {
    page: response.d.SearchInfo.Page,
    pageMax: response.d.SearchInfo.PageMax,
    results: cleanedResults,
  } as BooksFromAuthorCleanedOutput.CleanedSearchBookFromAuthorResponse;
}

export async function getBookAvailability(bookRscId: string, docbase: string = 'SYRACUSE') {
  const url =
    'https://bibliotheques.paris.fr/default/Portal/Services/ILSClient.svc/GetHoldings';

  const data = {
    Record: {
      RscId: bookRscId,
      Docbase: docbase,
    },
  } as BookAvailabilityInput.BookAvailabilityQuery;

  const response =
    await request<BookAvailabilityOutput.BookAvailabilityResponse>(
      'POST',
      url,
      data
    );

  const result = processBookAvailabilityResponse(response.d);

  return result;
}

function processBookAvailabilityResponse(
  response: BookAvailabilityOutput.BookAvailabilityResponse
) {
  const libraries: BookAvailabilityCleanedOutput.Library[] =
    response.Holdings.filter((holding) => holding.Other !== null).map((holding) => {
      const name = holding.Other.filter((item) => item.Key === 'SiteLabel')[0]
        .Value;
      const url = holding.Other.filter(
        (item) => item.Key === 'SiteLabelLink'
      )[0].Value;

      return {
        cote: holding.Cote,
        holdingId: holding.HoldingId,
        isAvailable: holding.IsAvailable,
        isLoanable: holding.IsLoanable,
        section: holding.Section,
        site: holding.Site,
        statut: holding.Statut,
        type: holding.Type,
        whenBack:
          holding.WhenBack && parse(holding.WhenBack, 'dd/MM/yyyy', new Date()),
        url: url as string,
        name: name as string,
      };
    });

  const fieldList = response.fieldList;

  const result: BookAvailabilityCleanedOutput.CleanedBookAvailabilityResponse =
    {
      identifier: fieldList.Identifier[0],
      title: fieldList.Title[0],
      authorName: fieldList.Author_sort[0],
      yearOfPublication: Number(fieldList.YearOfPublication_sort[0]),
      isbn: fieldList.Isbn[0],
      ean: fieldList.Ean[0],
      typeOfDocument: fieldList.TypeOfDocument[0],
      thumbnailSmallUrl: fieldList.ThumbSmall[0],
      thumbnailMediumUrl: fieldList.ThumbMedium[0],
      thumbnailLargeUrl: fieldList.ThumbLarge[0],
      isbn10: fieldList.Isbn10[0],
      libraries: libraries,
    };

  return result;
}

export async function getLibraryAddress(url: string) {
  const response = await fetch(url);

  const html = await response.text();

  const root = parseHtml(html);

  const address = root
    .querySelector('.sidebar-section.is-place')
    ?.querySelector('.sidebar-section-content');

  if (!address) {
    return null;
  }

  return parseAddress(address as unknown as HTMLElement);
}

function parseAddress(address: HTMLElement) {
  const childNodes = Array.from(address.childNodes);

  // Initialize an array to store non-strong text parts
  const textParts = [];

  // Iterate through each child node
  for (const node of childNodes) {
    // Check if the node is a text node and its parent is not <strong>
    // 3 == TEXT_NODE
    if (node.nodeType === 3 && node.parentNode?.nodeName !== 'STRONG') {
      textParts.push(node.textContent);
    }
  }

  // Join the text parts array into a single string
  const result = textParts.join('');

  return result;
}
