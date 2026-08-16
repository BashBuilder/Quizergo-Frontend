import { BookOpen, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const modes = [
  {
    title: "Real Past Questions",
    description:
      "Drill thousands of WAEC and JAMB past questions, organised by subject and ready whenever you are.",
    icon: BookOpen,
    badge: "Practice",
    color: "bg-primary-50 text-primary-600 border-primary-200",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&h=400&fit=crop",
  },
  {
    title: "Timed Mock Exams",
    description:
      "Pick your subjects, set a question count and time limit, then sit a mock exam under real exam conditions.",
    icon: Clock,
    badge: "Mock Exams",
    color: "bg-green-50 text-green-600 border-green-200",
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&h=400&fit=crop",
  },
  {
    title: "Instant Results & Review",
    description:
      "See your score the moment you submit, then review every question with the correct answer and a full explanation.",
    icon: CheckCircle2,
    badge: "Instant Feedback",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  },
  {
    title: "Track Your Progress",
    description:
      "Keep a full history of every quiz you've taken and watch your scores improve over time.",
    icon: TrendingUp,
    badge: "Progress",
    color: "bg-primary-50 text-primary-600 border-primary-200",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&h=400&fit=crop",
  },
];

export default function Features() {
  return (
    <div className="w-full">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="font-semibold uppercase tracking-widest text-primary-600">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Everything you need to pass
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {modes.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="rounded-3xl border-primary-100 shadow-lg transition hover:-translate-y-1"
                >
                  <CardContent className="p-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary">
                      <Icon />
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* <section className="bg-slate-50 px-6 py-20 lg:px-16">
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
      </section> */}
    </div>
  );
}
