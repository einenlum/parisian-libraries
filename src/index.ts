export {
  searchAuthors,
  searchBooksFromAuthor,
  getBookAvailability,
  getLibraryAddress,
} from './libraries.js';

export type { CleanedOutput as AuthorSearch } from './types/author_search.js';
export type { CleanedOutput as BooksFromAuthor } from './types/books_from_author_search.js';
export type { CleanedOutput as BookAvailability } from './types/book_availability.js';
