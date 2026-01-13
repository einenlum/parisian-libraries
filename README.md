# Parisian Libraries

A TypeScript library for querying the Paris public library system (bibliotheques.paris.fr).

## Features

- Search for authors by name
- Find books by a specific author
- Check book availability across all Paris library branches
- Get library addresses

## Installation

```bash
npm install parisian-libraries
```

## Usage

```typescript
import {
  searchAuthors,
  searchBooksFromAuthor,
  getBookAvailability,
  getLibraryAddress,
} from 'parisian-libraries';

// Search for an author
const authors = await searchAuthors('mathieu palain');
console.log(authors);
// [{ id: '...', label: 'Palain, Mathieu' }]

// Get books from an author
const books = await searchBooksFromAuthor(authors[0].id);
console.log(books.results);
// [{ title: '...', url: '...', description: '...', publisher: '...', rscId: '...' }]

// Check availability of a book
const availability = await getBookAvailability(books.results[0].rscId);
console.log(availability);
// {
//   title: '...',
//   authorName: '...',
//   isbn: '...',
//   libraries: [
//     { name: '75001 - La Canopée', isAvailable: true, url: '...', ... }
//   ]
// }

// Get a library's address
const address = await getLibraryAddress(
  'https://www.paris.fr/lieux/bibliotheque-assia-djebar-19114'
);
console.log(address);
// '16 rue de Bagnolet, 75020 Paris'
```

## Development

```bash
# Build the project
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Run the example
node dist/index.js

# Run tests
npm test
```

## API Reference

### `searchAuthors(authorName: string)`

Search for authors by name. Returns an array of authors with `id` and `label`.

### `searchBooksFromAuthor(authorId: string)`

Get books by an author. Returns paginated results with `page`, `pageMax`, and `results` array containing book details.

### `getBookAvailability(bookRscId: string)`

Check availability of a book across all Paris library branches. Returns book metadata and an array of libraries with availability status, return dates, and location info.

### `getLibraryAddress(url: string)`

Fetch and parse a library's address from its paris.fr page. Returns the address string or `null` if not found.

## Testing

The project uses Jest with ts-jest for testing. Tests mock HTTP requests to avoid hitting external APIs.

```bash
npm test
```

## License

MIT
