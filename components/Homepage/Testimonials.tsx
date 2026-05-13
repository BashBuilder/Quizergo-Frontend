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

export default function Testimonials() {
  return (
    <div className="w-full">
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
