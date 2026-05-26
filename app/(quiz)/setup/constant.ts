export const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

export const SUBJECTS = [
  {
    code: "CSC 301",
    name: "Data Structures",
    topics: [
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & BST",
      "AVL Trees",
      "Graphs",
      "Sorting Algorithms",
      "Hash Tables",
    ],
  },
  {
    code: "MTH 301",
    name: "Numerical Methods",
    topics: [
      "Root Finding",
      "Interpolation",
      "Numerical Integration",
      "ODEs",
      "Linear Systems",
    ],
  },
  {
    code: "CSC 321",
    name: "Software Engineering",
    topics: [
      "SDLC Models",
      "Design Patterns",
      "Testing Strategies",
      "Agile & Scrum",
      "UML Diagrams",
      "SOLID Principles",
    ],
  },
];

export const QUESTION_COUNTS = [5, 10, 15, 20, 30, 40, 50];

export const DURATIONS = [
  { label: "No limit", value: "0" },
  { label: "5 minutes", value: "5" },
  { label: "10 minutes", value: "10" },
  { label: "20 minutes", value: "20" },
  { label: "30 minutes", value: "30" },
  { label: "45 minutes", value: "45" },
  { label: "60 minutes", value: "60" },
];

export const MODES = [
  // { value: "topic", label: "By topic" },
  { value: "year", label: "By year" },
  { value: "random", label: "Random" },
];
