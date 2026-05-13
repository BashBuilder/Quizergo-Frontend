/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";

const Hero = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);

  const slides = useMemo(
    () => [
      {
        id: 1,
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        alt: "Students studying together",
      },
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
        alt: "Student learning online",
      },
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        alt: "Student taking quiz practice test",
      },
      {
        id: 4,
        src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
        alt: "Focused student reading",
      },
    ],
    [],
  );

  // Auto slide every 3s
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-white to-primary-100" />
      <Image
        width={1000}
        height={1000}
        alt="background image"
        src="/assets/olav-ahrens-rotne-jvBXiynINGE-unsplash.jpg"
        loading="lazy"
        decoding="async"
        className="absolute top-0 left-0 h-full w-full object-cover opacity-5"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 px-6 pt-10 pb-20">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Study Smart. <br />
            Pass <span className="text-primary">WAEC & JAMB</span> with
            Confidence.
          </h1>

          <p className="mt-6 max-w-xl leading-5 text-slate-600">
            Practice thousands of questions, join live sessions, challenge
            friends, and watch tutorials — all in one app.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary px-8 hover:bg-primary">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button size="lg" variant="outline">
              Watch Live Class
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            Trusted by 50,000+ Nigerian students
          </div>
        </div>

        <div className="relative h-full min-h-40 overflow-hidden">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
            }}
            className="h-full w-full"
          >
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full min-h-105 w-full object-cover shadow-2xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Hero;
