export interface VerseTranslation {
  text: string;
  reference: string;
}

export interface DailyVerse {
  id: string;
  date: string;
  amp: VerseTranslation;
  niv: VerseTranslation;
  createdAt: string;
}
