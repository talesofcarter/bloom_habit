// src/data/verses.ts
export interface Verse {
  text: string;
  reference: string;
}

// KJV text — public domain, safe to reproduce in full.
export const verses: Verse[] = [
  {
    text: "I can do all things through Christ which strengtheneth me.",
    reference: "Philippians 4:13",
  },
  {
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
    reference: "Isaiah 41:10",
  },
  {
    text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    reference: "Psalm 34:18",
  },
  {
    text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    reference: "Lamentations 3:22–23",
  },
  {
    text: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.",
    reference: "2 Corinthians 5:17",
  },
  {
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    reference: "Proverbs 3:5–6",
  },
  {
    text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    reference: "Joshua 1:9",
  },
  {
    text: "God is our refuge and strength, a very present help in trouble.",
    reference: "Psalm 46:1",
  },
  {
    text: "Weeping may endure for a night, but joy cometh in the morning.",
    reference: "Psalm 30:5",
  },
];
