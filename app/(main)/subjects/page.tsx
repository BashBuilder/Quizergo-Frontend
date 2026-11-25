import type { Metadata } from "next";
import Subjects from "@/components/Homepage/Subjects";

export const metadata: Metadata = {
  title: "Subjects",
  description:
    "The full Quizergo subject index for JAMB and WAEC — sciences, arts and commercial papers.",
};

const SubjectsPage = () => {
  return <Subjects />;
};

export default SubjectsPage;
