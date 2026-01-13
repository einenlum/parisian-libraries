# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript library for querying the Paris public library system (bibliotheques.paris.fr). It provides functions to search for authors, find their books, check availability across library branches, and get library addresses.

## Commands

- `npm run build` - Compile TypeScript to JavaScript (outputs to `dist/`)
- `npm run dev` - Watch mode for development (auto-recompiles on changes)
- `npm test` - Run the test suite with Jest
- `node dist/index.js` - Run the compiled application

## Architecture

### Core Modules

- **`src/client.ts`** - Generic HTTP client wrapper around `fetch()`. Handles POST/GET requests with JSON serialization and response validation via `CallResult<T>` type.

- **`src/libraries.ts`** - Main API layer with four exported functions:
  - `searchAuthors(authorName)` - Search authors by name
  - `searchBooksFromAuthor(authorId)` - Get books by an author using their ID
  - `getBookAvailability(bookRscId)` - Check which libraries have a book and availability status
  - `getLibraryAddress(url)` - Scrape library address from paris.fr pages

- **`src/index.ts`** - Example usage/entry point demonstrating the typical flow: author search → book search → availability check

### Type System

Types in `src/types/` follow a consistent namespace pattern:
- `Input` - Request payload types
- `Output` - Raw API response types
- `CleanedOutput` - Normalized/cleaned response types returned to consumers

Each API endpoint has its own type file (`author_search.ts`, `books_from_author_search.ts`, `book_availability.ts`).

### External APIs

The library interacts with:
- `bibliotheques.paris.fr` - JSON API endpoints for catalog search and availability
- `www.paris.fr` - HTML pages scraped for library address information

### Testing

Tests are located in `tests/` (separate from source) and use Jest with ts-jest for TypeScript support.

- **`tests/client.test.ts`** - Tests for the HTTP client (POST/GET requests, error handling)
- **`tests/libraries.test.ts`** - Tests for all exported library functions

Tests mock the global `fetch` function to avoid making real network requests.
