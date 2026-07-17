export interface Milestone {
  id: string;
  days: number;
  title: string;
  description: string;
  earned: boolean;
}

// Gamification
export const milestoneConfig: Omit<Milestone, "earned">[] = [
  {
    id: "m1",
    days: 1,
    title: "First Step",
    description: "Your first day of commitment.",
  },
  {
    id: "m3",
    days: 3,
    title: "Three Days",
    description: "Breaking the initial cycle.",
  },
  {
    id: "m7",
    days: 7,
    title: "One Week",
    description: "A full week of progress!",
  },
  {
    id: "m30",
    days: 30,
    title: "First Month",
    description: "Building a true habit.",
  },
  {
    id: "m90",
    days: 90,
    title: "The Reboot",
    description: "Significant neural rewiring.",
  },
];
