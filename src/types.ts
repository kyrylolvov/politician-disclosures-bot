export interface ClerkDisclosure {
  name: string;
  office: string;
  filingYear: string;
  filingType: string;
  fileUrl: string;
  documentId: string;
}

export interface VisitedEntry {
  docId: string;
  filingDate: string; // YYYY-MM-DD
}
