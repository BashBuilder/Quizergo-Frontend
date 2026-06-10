export const student = {
  firstName: "Adaeze",
  lastName: "Okonkwo",
  level: "300L",
  department: "Computer Science",
  xp: 3_840,
  xpToNext: 5_000,
  streak: 12,
  rank: 4,
  totalStudents: 142,
};

export const subjects = [
  {
    id: 1,
    code: "CSC 301",
    name: "Data Structures",
    score: 87,
    sessions: 14,
    trend: "up",
    color: "violet",
  },
  {
    id: 2,
    code: "CSC 305",
    name: "Operating Systems",
    score: 72,
    sessions: 9,
    trend: "up",
    color: "blue",
  },
  {
    id: 3,
    code: "CSC 311",
    name: "Computer Networks",
    score: 61,
    sessions: 6,
    trend: "down",
    color: "amber",
  },
  {
    id: 4,
    code: "MTH 301",
    name: "Numerical Methods",
    score: 55,
    sessions: 4,
    trend: "flat",
    color: "rose",
  },
  {
    id: 5,
    code: "CSC 321",
    name: "Software Engineering",
    score: 90,
    sessions: 18,
    trend: "up",
    color: "emerald",
  },
];

export const recentSessions = [
  {
    id: 1,
    subject: "Data Structures",
    topic: "AVL Trees & Rotations",
    score: 92,
    time: "2h ago",
    questions: 20,
    correct: 18,
  },
  {
    id: 2,
    subject: "Software Engineering",
    topic: "SOLID Principles",
    score: 88,
    time: "Yesterday",
    questions: 15,
    correct: 13,
  },
  {
    id: 3,
    subject: "Operating Systems",
    topic: "Deadlock Detection",
    score: 74,
    time: "2 days ago",
    questions: 25,
    correct: 18,
  },
  {
    id: 4,
    subject: "Computer Networks",
    topic: "TCP/IP Stack",
    score: 60,
    time: "3 days ago",
    questions: 20,
    correct: 12,
  },
];

export const lastRead = {
  subject: "Data Structures",
  topic: "Red-Black Trees",
  progress: 65,
  estimatedTime: "18 min left",
  chapter: "Chapter 7 — Balanced BSTs",
};

export const todos = [
  {
    id: 1,
    task: "Complete Computer Networks practice quiz",
    priority: "high",
    due: "Today",
    done: false,
  },
  {
    id: 2,
    task: "Revise Numerical Methods — Chapter 4",
    priority: "high",
    due: "Today",
    done: false,
  },
  {
    id: 3,
    task: "Review OS midterm corrections",
    priority: "medium",
    due: "Tomorrow",
    done: false,
  },
  {
    id: 4,
    task: "Attempt Software Eng challenge set",
    priority: "low",
    due: "This week",
    done: true,
  },
  {
    id: 5,
    task: "Join live session — CSC 311",
    priority: "medium",
    due: "Fri 4pm",
    done: false,
  },
];

export const weeklyActivity = [
  { day: "Mon", sessions: 3 },
  { day: "Tue", sessions: 5 },
  { day: "Wed", sessions: 2 },
  { day: "Thu", sessions: 7 },
  { day: "Fri", sessions: 4 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 6 },
];
