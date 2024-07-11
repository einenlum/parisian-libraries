import { request } from './client.js';
import { CleanedOutput, Output } from './types/author_search.js';

export default async function searchAuthors(authorName: string) {
  const url =
    'https://bibliotheques.paris.fr/default/Portal/Search.svc/Suggest';

  const body = {
    term: authorName,
    fieldUid: 464,
    scenarioCode: 'CATALOGUE',
  };

  const response = await request<CleanedOutput.AuthorSearchElement[]>(
    'POST',
    url,
    body
  );

  return response.d.map((author: Output.AuthorSearchElement) => {
    return {
      id: author.id,
      label: author.label,
    };
  });
}
