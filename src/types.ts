export interface ClerkMember {
  Prefix?: string[];
  Last?: string[];
  First?: string[];
  Suffix?: string[];
  FilingType?: string[];
  StateDst?: string[];
  Year?: string[];
  FilingDate?: string[];
  DocID?: string[];
}

export interface ClerkParsedXml {
  FinancialDisclosure?: {
    Member?: ClerkMember[];
  };
}

export interface VisitedEntry {
  docId: string;
  filingDate: string; // YYYY-MM-DD
}
