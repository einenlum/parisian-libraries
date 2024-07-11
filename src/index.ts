import { searchAuthors, searchBooksFromAuthor } from './libraries.js';

const results = await searchAuthors('mathieu palain');

console.log(await searchBooksFromAuthor(results[0].id));
