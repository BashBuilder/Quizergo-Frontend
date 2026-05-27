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

declare interface QuestionType {
  id: number;
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
