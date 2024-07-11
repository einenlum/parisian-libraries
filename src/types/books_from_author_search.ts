export namespace Input {
  export type SearchBooksFromAuthor = {
    query: {
      Page: number;
      PageRange: number;
      ResultSize: number;
      ScenarioCode: string;
      Grid: string;
    };
  };
}

export namespace Output {
  export type BooksFromAuthorResultItem = {
    FriendlyUrl: string;
    Resource: {
      // Author
      Crtr: string;
      Desc: string;
      Id: string;
      Pbls: string;
      Ttl: string;
      RscId: string;
    };
  };

  export type BooksFromAuthorResponse = {
    SearchInfo: {
      Page: number;
      PageMax: number;
    };
    Results: BooksFromAuthorResultItem[];
  };
}

export namespace CleanedOutput {
  export type BookFromAuthorResultItem = {
    url: string;
    title: string;
    description: string;
    id: string;
    publisher: string;
    rscId: string;
  };

  export type CleanedSearchBookFromAuthorResponse = {
    page: number;
    pageMax: number;
    results: BookFromAuthorResultItem[];
  };
}
