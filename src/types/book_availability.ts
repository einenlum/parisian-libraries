export namespace Input {
  export type BookAvailabilityQuery = {
    Record: {
      RscId: string;
      Docbase: string;
    };
  };
}

export namespace Output {
  type KeyValue = {
    Key: string;
    Value: string;
  };

  type HoldingColumn = {
    Name: string;
    Order: number;
    Labels: KeyValue[];
  };

  type Holding = {
    Cote: string;
    HoldingId: string;
    IsAvailable: boolean;
    IsLoanable: boolean;
    Other: KeyValue[] | null;
    /*
    { Key: 'SiteLabel'; Value: '75001 - La Canopée' },
    { Key: 'Institution'; Value: '' },
    {
      Key: 'InstitutionWording'
      Value: 'Bibliothèques de prêt de la Ville de Paris'
    },
    { Key: 'SectionCode'; Value: 'CANOAD' },
    { Key: 'NUM_FASCICULE'; Value: '# #' },
    {
      Key: 'SiteLabelLink'
      Value: 'https://www.paris.fr/lieux/mediatheque-de-la-canopee-16634'
    },
    { Key: 'StatutLabel'; Value: 'En rayon' },
     */

    Section: string;
    Site: string;
    Statut: string;
    Type: string;
    WhenBack: string | null;
  };

  export type BookAvailabilityResponse = {
    HoldingColumns: HoldingColumn[];
    Holdings: Holding[];
    fieldList: {
      Identifier: [string];
      Title: [string];
      Author_sort: [string];
      YearOfPublication_sort: [string];
      Isbn: [string];
      Ean: [string];
      TypeOfDocument: ['Livre'];
      ThumbSmall: [string];
      ThumbMedium: [string];
      ThumbLarge: [string];
      Isbn10: [string];
    };
  };
}

export namespace CleanedOutput {
  export type Library = {
    url: string;
    name: string;
    cote: string;
    isAvailable: boolean;
    isLoanable: boolean;
    whenBack: Date | null;
  };

  export type CleanedBookAvailabilityResponse = {
    identifier: string;
    title: string;
    authorName: string;
    yearOfPublication: number;
    isbn: string;
    ean: string;
    typeOfDocument: string;
    thumbnailSmallUrl: string;
    thumbnailMediumUrl: string;
    thumbnailLargeUrl: string;
    isbn10: string;
    libraries: Library[];
  };
}
