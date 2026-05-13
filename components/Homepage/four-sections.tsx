import { BookOpen, Video, Trophy, Users, ArrowRight } from "lucide-react";

const modes = [
  {
    title: "Self-Paced Practice Sessions",
    description:
      "Drill thousands of WAEC and JAMB past questions at your own pace with instant explanations.",
    icon: BookOpen,
    badge: "Practices",
    color: "bg-primary-50 text-primary-600 border-primary-200",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&h=400&fit=crop",
  },
  {
    title: "Real-Time Tutor-Led Classes",
    description:
      "Join live interactive sessions with expert tutors and ask questions in real-time.",
    icon: Users,
    badge: "Live Sessions",
    color: "bg-green-50 text-green-600 border-green-200",
    image:
      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&h=400&fit=crop",
  },
  {
    title: "Compete With Peers Nationwide",
    description:
      "Take on timed quizzes, climb leaderboards, and challenge students across Nigeria.",
    icon: Trophy,
    badge: "Challenges",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop",
  },
  {
    title: "Video Lessons for Every Topic",
    description:
      "Watch focused tutorials covering every examinable WAEC and JAMB topic.",
    icon: Video,
    badge: "Tutorials",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop",
  },
];

const subjects = [
  {
    name: "Mathematics",
    emoji: "📐",
    questions: "1,840 Questions",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop",
  },
  {
    name: "English",
    emoji: "✍️",
    questions: "2,100 Questions",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=500&fit=crop",
  },
  {
    name: "Biology",
    emoji: "🧬",
    questions: "1,620 Questions",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=500&fit=crop",
  },
  {
    name: "Chemistry",
    emoji: "⚗️",
    questions: "1,450 Questions",
    image:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=500&fit=crop",
  },
];

const steps = [
  {
    title: "Create Free Account",
    description: "Sign up in seconds and start preparing immediately.",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop",
  },
  {
    title: "Choose Your Subjects",
    description: "Pick WAEC, JAMB, or NECO subjects you want to prepare for.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
  },
  {
    title: "Practice Daily",
    description: "Answer questions, join sessions, and improve every day.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&h=300&fit=crop",
  },
  {
    title: "Pass With Confidence",
    description: "Walk into your exam fully prepared and confident.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=300&fit=crop",
  },
];

const testimonials = [
  {
    name: "Adebayo Olamide",
    role: "Scored 312 in JAMB",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    text: "QuizerGo helped me improve my Maths and Physics score massively within 3 months.",
  },
  {
    name: "Chisom Ihejirika",
    role: "7 A's in WAEC",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
    text: "The live sessions made difficult topics easy to understand. It felt like personal tutoring.",
    featured: true,
  },
  {
    name: "Mohammed Abubakar",
    role: "Chemistry Grade B",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "Challenge mode made studying fun and competitive. I improved faster than I expected.",
  },
];

export default function QuizerGoSections() {
  return (
    <div className="w-full">
      {/* 4 MODES SECTION */}
      <section className="bg-slate-50 px-6 py-20 lg:px-16">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
              What You Can Do
            </p>

            <h2 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Four ways to prepare and win.
            </h2>
          </div>

          <button className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
            Explore all features
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {modes.map((mode, index) => {
            const Icon = mode.icon;

            return (
              <div
                key={index}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="grid md:grid-cols-2">
                  <img
                    src={mode.image}
                    alt={mode.title}
                    className="h-64 w-full object-cover md:h-full"
                  />

                  <div className="flex flex-col justify-between p-8">
                    <div>
                      <div
                        className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${mode.color}`}
                      >
                        <Icon size={14} />
                        {mode.badge}
                      </div>

                      <h3 className="mb-4 text-2xl font-extrabold text-slate-900">
                        {mode.title}
                      </h3>

                      <p className="leading-7 text-slate-600">
                        {mode.description}
                      </p>
                    </div>

                    <button className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-600 transition group-hover:gap-3">
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUBJECTS SECTION */}
      <section className="bg-slate-950 px-6 py-20 lg:px-16">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-400">
              Subjects Covered
            </p>

            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              All your exam subjects.
            </h2>

            <p className="max-w-2xl leading-7 text-slate-300">
              From sciences to arts and commercial subjects, everything you need
              is available in one place.
            </p>
          </div>

          <button className="w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
            View all subjects
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={subject.image}
                alt={subject.name}
                className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 p-6">
                <div className="mb-2 text-3xl">{subject.emoji}</div>

                <h3 className="text-2xl font-bold text-white">
                  {subject.name}
                </h3>

                <p className="mt-1 text-sm text-primary-300">
                  {subject.questions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 px-6 py-20 lg:px-16">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
            How It Works
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            From sign-up to exam-ready.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary-100 bg-white text-2xl font-extrabold text-primary-600 shadow-sm">
                {index + 1}
              </div>

              <img
                src={step.image}
                alt={step.title}
                className="mb-6 h-44 w-full rounded-2xl object-cover"
              />

              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT STORIES */}
      <section className="bg-white px-6 py-20 lg:px-16">
        <div className="mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
            Student Stories
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Real students. Real results.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                item.featured
                  ? "border-primary bg-primary-600 text-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-5 text-yellow-400">★★★★★</div>

              <p
                className={`mb-8 leading-8 ${
                  item.featured ? "text-primary-100" : "text-slate-600"
                }`}
              >
                {item.text}
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div>
                  <h4
                    className={`font-bold ${
                      item.featured ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.name}
                  </h4>

                  <p
                    className={`text-sm ${
                      item.featured ? "text-primary-200" : "text-slate-500"
                    }`}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
