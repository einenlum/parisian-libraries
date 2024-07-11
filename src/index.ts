import {
  getBookAvailability,
  getLibraryAddress,
  searchAuthors,
  searchBooksFromAuthor,
} from './libraries.js';

const authors = await searchAuthors('mathieu palain');
const books = await searchBooksFromAuthor(authors[0].id);

const availability = await getBookAvailability(books.results[0].rscId);
console.log(availability);

const address = await getLibraryAddress(
  'https://www.paris.fr/lieux/bibliotheque-assia-djebar-19114'
);
console.log(address);
