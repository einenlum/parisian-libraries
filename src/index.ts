import {
  getBookAvailability,
  searchAuthors,
  searchBooksFromAuthor,
} from './libraries.js';

const authors = await searchAuthors('mathieu palain');
const books = await searchBooksFromAuthor(authors[0].id);

const availability = await getBookAvailability(books.results[0].rscId);
console.log(availability);
