export namespace Input {
  export type AuthorSearch = {
    term: string;
    fieldUid: 464;
    scenarioCode: 'CATALOGUE';
  };
}

export namespace Output {
  export type AuthorSearchElement = {
    id: string;
    label: string;
    query: string;
    value: string;
  };
}

export namespace CleanedOutput {
  export type AuthorSearchElement = {
    id: string;
    label: string;
  };
}
