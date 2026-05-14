import { pricing } from "@/data/constants";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "@base-ui/react";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-primary-600">
            Pricing
          </p>
          <h2 className="mt-3 text-4xl font-black">
            Start Free. Upgrade Anytime.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <Card
              key={plan.name}
              className={`rounded-3xl p-2 shadow-xl ${
                plan.featured
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200"
              }`}
            >
              <CardContent className="p-8">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-3 text-4xl font-black">{plan.price}</div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 w-full ${
                    plan.featured
                      ? "bg-white text-primary hover:bg-primary-50"
                      : "bg-primary-600 hover:bg-primary"
                  }`}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Pricing);
