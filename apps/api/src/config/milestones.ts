export interface Milestone {
  id: string;
  days: number;
  title: string;
  description: string;
  earned: boolean;
}

// Gamification
// Milestones are ordered by ascending day count. Extra checkpoints were added
// between the original 7-day and 30-day markers (and beyond 90 days) so users
// get more frequent, motivating wins across a longer recovery journey instead
// of a three-week gap with nothing to look forward to.
export const milestoneConfig: Omit<Milestone, "earned">[] = [
  {
    id: "m1",
    days: 1,
    title: "First Step",
    description: "Your first day of commitment.",
  },
  {
    id: "m2",
    days: 2,
    title: "Two In A Row",
    description: "Momentum is starting to build.",
  },
  {
    id: "m3",
    days: 3,
    title: "Three Days",
    description: "Breaking the initial cycle.",
  },
  {
    id: "m5",
    days: 5,
    title: "Five Days Strong",
    description: "The early days are the hardest — you're pushing through.",
  },
  {
    id: "m7",
    days: 7,
    title: "One Week",
    description: "A full week of progress!",
  },
  {
    id: "m10",
    days: 10,
    title: "Double Digits",
    description: "Ten days of showing up for yourself.",
  },
  {
    id: "m14",
    days: 14,
    title: "Two Weeks",
    description: "Two weeks of consistency — it's becoming a rhythm.",
  },
  {
    id: "m21",
    days: 21,
    title: "Three Weeks",
    description: "Often cited as the point a new habit starts to form.",
  },
  {
    id: "m30",
    days: 30,
    title: "First Month",
    description: "Building a true habit.",
  },
  {
    id: "m45",
    days: 45,
    title: "Six Weeks",
    description: "Well past the halfway point to two months.",
  },
  {
    id: "m60",
    days: 60,
    title: "Two Months",
    description: "Two full months of dedication.",
  },
  {
    id: "m90",
    days: 90,
    title: "The Reboot",
    description: "Significant neural rewiring.",
  },
  {
    id: "m120",
    days: 120,
    title: "Four Months",
    description: "A season of steady, quiet growth.",
  },
  {
    id: "m180",
    days: 180,
    title: "Half a Year",
    description: "Six months of showing up, one day at a time.",
  },
  {
    id: "m270",
    days: 270,
    title: "Nine Months",
    description: "Nearly a year of transformation.",
  },
  {
    id: "m365",
    days: 365,
    title: "One Year",
    description: "A full year of freedom and growth.",
  },
];
