export type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
  subject: string;
};

export const QUIZ_META = {
  title: "Data Structures — Full Practice",
  subject: "CSC 301",
  totalTime: 30 * 60, // 30 minutes in seconds
  mode: "Full Practice",
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
    subject: "Trees",
  },
  {
    id: 2,
    text: "Which data structure uses the LIFO (Last In, First Out) principle?",
    options: ["Queue", "Linked List", "Stack", "Heap"],
    correct: 2,
    subject: "Linear Structures",
  },
  {
    id: 3,
    text: "In an AVL tree, what is the maximum allowed height difference between the left and right subtrees of any node?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    subject: "Trees",
  },
  {
    id: 4,
    text: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correct: 2,
    subject: "Sorting",
  },
  {
    id: 5,
    text: "What is the space complexity of Depth-First Search (DFS) on a graph with V vertices and E edges?",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V²)"],
    correct: 0,
    subject: "Graphs",
  },
  {
    id: 6,
    text: "Which of the following is NOT a property of a Min-Heap?",
    options: [
      "The root contains the minimum element",
      "Every parent node is smaller than or equal to its children",
      "It is always a complete binary tree",
      "In-order traversal gives a sorted sequence",
    ],
    correct: 3,
    subject: "Trees",
  },
  {
    id: 7,
    text: "What data structure is typically used to implement Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Priority Queue", "Deque"],
    correct: 1,
    subject: "Graphs",
  },
  {
    id: 8,
    text: "The amortized time complexity of push and pop operations in a dynamic array is:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 0,
    subject: "Arrays",
  },
  {
    id: 9,
    text: "Which of the following graph representations has better space complexity for a sparse graph?",
    options: [
      "Adjacency Matrix",
      "Adjacency List",
      "Incidence Matrix",
      "They are all the same",
    ],
    correct: 1,
    subject: "Graphs",
  },
  {
    id: 10,
    text: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correct: 2,
    subject: "Sorting",
  },
  {
    id: 11,
    text: "In a doubly linked list, what additional pointer does each node have compared to a singly linked list?",
    options: [
      "A pointer to the head",
      "A pointer to the previous node",
      "A pointer to the tail",
      "A pointer to the middle node",
    ],
    correct: 1,
    subject: "Linear Structures",
  },
  {
    id: 12,
    text: "Which traversal of a BST yields nodes in sorted order?",
    options: ["Pre-order", "Post-order", "In-order", "Level-order"],
    correct: 2,
    subject: "Trees",
  },
  {
    id: 13,
    text: "Hash tables achieve O(1) average-case lookup by using:",
    options: [
      "Binary search",
      "A hash function to map keys to indices",
      "Sorted arrays",
      "Tree-based indexing",
    ],
    correct: 1,
    subject: "Hash Tables",
  },
  {
    id: 14,
    text: "What is the primary advantage of a circular linked list over a standard linked list?",
    options: [
      "Faster search operations",
      "Efficient traversal from any node back to itself",
      "Lower memory usage",
      "Easier deletion of the head node",
    ],
    correct: 1,
    subject: "Linear Structures",
  },
  {
    id: 15,
    text: "Dijkstra's algorithm is used to find:",
    options: [
      "The minimum spanning tree",
      "The shortest path between all pairs of nodes",
      "The shortest path from a source to all other nodes",
      "The topological ordering of nodes",
    ],
    correct: 2,
    subject: "Graphs",
  },
];
