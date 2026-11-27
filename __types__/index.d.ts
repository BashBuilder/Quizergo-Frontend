declare interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

declare interface Subject {
  id: string;
  name: string;
  apiKey: string;
  image: string;
  questions: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

declare interface Option {
  a: string;
  b: string;
  c: string;
  d: string;
  e?: string;
}

declare interface QuestionType {
  id: number | string;
  question: string;
  option: Option;
  section: string;
  image: string;
  solution: string;
  examtype: string;
  examyear: string;
  questionNub: number;
  hasPassage: number;
  category: string;
}

/**
 * Represents a single question in a quiz result breakdown.
 * Mirrors the backend's structure for graded results.
 */
declare interface BreakdownQuestion {
  questionId: string | number;
  question: string;
  image?: string | null;
  option?: Record<string, string>;
  userAnswer: string | null;
  correctAnswer: string;
  solution: string | null;
  status: "correct" | "incorrect" | "skipped";
}

declare interface BreakdownGroup {
  subject: string;
  questions: BreakdownQuestion[];
}

declare interface SubjectCount {
  subject: string;
  count: number;
}

declare interface QuizResult {
  sessionId: string;
  score: number;
  total: number;
  correct: SubjectCount[];
  incorrect: SubjectCount[];
  skipped: SubjectCount[];
  timeTaken: number;
  breakdown: BreakdownGroup[];
  submittedAt: number;
}

declare interface Session {
  sessionId: string;
  totalQuestions: number;
  duration: number | null;
  expiresAt: number | string | null;
  questions: SubjectGroup[];
}

declare interface SubjectGroup {
  subject: string;
  questions: QuestionType[];
}

type AnswersMap = Record<string, Record<string, string>>;