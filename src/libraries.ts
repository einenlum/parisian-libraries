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

  const cleanedResults = results.map((result) => {
    return {
      url: result.FriendlyUrl,
      title: result.Resource.Ttl,
      description: result.Resource.Desc,
      publisher: result.Resource.Pbls,
      id: result.Resource.Id,
      rscId: result.Resource.RscId,
    } as BooksFromAuthorCleanedOutput.BookFromAuthorResultItem;
  });

  return {
    page: response.d.SearchInfo.Page,
    pageMax: response.d.SearchInfo.PageMax,
    results: cleanedResults,
  } as BooksFromAuthorCleanedOutput.CleanedSearchBookFromAuthorResponse;
}
