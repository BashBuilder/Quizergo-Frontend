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

export default function Subjects() {
  return (
    <div className="w-full">
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
    </div>
  );
}
