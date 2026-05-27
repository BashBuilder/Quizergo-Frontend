// import { cn } from "@/lib/utils";
// import { Question } from "./constants";

// export default function ResultsPage({
//   answers,
//   questions,
//   timeTaken,
//   onRetry,
// }: {
//   answers: Record<number, number>;
//   questions: QuestionType[];
//   timeTaken: number;
//   onRetry: () => void;
// }) {
//   const correct = questions.filter((q) => answers[q.id] === q.correct).length;
//   const score = Math.round((correct / questions.length) * 100);
//   const mins = Math.floor(timeTaken / 60);
//   const secs = timeTaken % 60;

//   return (
//     <div className="min-h-screen bg-[oklch(0.99_0.01_265)] flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl">
//         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
//           {/* Score hero */}
//           <div className="bg-linear-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
//             <p className="text-sm text-white/50 uppercase tracking-widest font-semibold mb-4">
//               Session Complete
//             </p>
//             <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
//               <svg
//                 className="w-32 h-32 -rotate-90"
//                 viewBox="0 0 120 120"
//                 aria-hidden="true"
//               >
//                 <circle
//                   cx="60"
//                   cy="60"
//                   r="54"
//                   fill="none"
//                   stroke="rgba(255,255,255,0.1)"
//                   strokeWidth="8"
//                 />
//                 <circle
//                   cx="60"
//                   cy="60"
//                   r="54"
//                   fill="none"
//                   stroke={
//                     score >= 80
//                       ? "#34d399"
//                       : score >= 60
//                         ? "#fbbf24"
//                         : "#f87171"
//                   }
//                   strokeWidth="8"
//                   strokeDasharray={`${(score / 100) * 339.3} 339.3`}
//                   strokeLinecap="round"
//                 />
//               </svg>
//               <div className="absolute text-center">
//                 <p className="text-4xl font-bold text-white">{score}%</p>
//               </div>
//             </div>
//             <p className="text-white/60 text-sm">
//               {correct} of {questions.length} correct
//             </p>
//           </div>

//           <div className="p-6">
//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-3 mb-6">
//               {[
//                 {
//                   label: "Score",
//                   value: `${score}%`,
//                   sub:
//                     score >= 80
//                       ? "Excellent"
//                       : score >= 60
//                         ? "Good"
//                         : "Needs work",
//                 },
//                 {
//                   label: "Correct",
//                   value: correct,
//                   sub: `of ${questions.length}`,
//                 },
//                 { label: "Time", value: `${mins}m ${secs}s`, sub: "taken" },
//               ].map((s) => (
//                 <div
//                   key={s.label}
//                   className="bg-slate-50 rounded-2xl p-3 text-center"
//                 >
//                   <p className="text-xl font-bold text-slate-900">{s.value}</p>
//                   <p className="text-xs text-slate-500">{s.label}</p>
//                   <p className="text-[10px] text-slate-400">{s.sub}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Question review */}
//             <div className="mb-6">
//               <h3 className="text-sm font-bold text-slate-700 mb-3">Review</h3>
//               <div className="flex flex-wrap gap-2">
//                 {questions.map((q) => {
//                   const answered = answers[q.id] !== undefined;
//                   const isCorrect = answers[q.id] === q.correct;
//                   return (
//                     <div
//                       key={q.id}
//                       className={cn(
//                         "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
//                         !answered
//                           ? "bg-slate-100 text-slate-400"
//                           : isCorrect
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-rose-100 text-rose-700",
//                       )}
//                       title={`Q${q.id}: ${!answered ? "Skipped" : isCorrect ? "Correct" : "Wrong"}`}
//                     >
//                       {q.id}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={onRetry}
//                 className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
//               >
//                 Try Again
//               </button>
//               <a
//                 href="/practice"
//                 className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-center"
//               >
//                 Back to Practice
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
