export type FAQ = {
  id: string;
  question: string;
  answer: string;
  audience: "buyer" | "agent" | "general";
};

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Do I need an Immersive VR headset to use VBYM?",
    answer:
      "No headset is required. You can explore every tour on desktop or mobile using drag or swipe to look around.",
    audience: "general",
  },
  {
    id: "faq-2",
    question: "How accurate are the Immersive VR tours?",
    answer:
      "Tours are captured using professional 360° equipment and represent the property at the time of capture, with clear labels for key spaces.",
    audience: "buyer",
  },
  {
    id: "faq-3",
    question: "Can I save properties to revisit later?",
    answer:
      "Yes. Save properties or searches and receive updates as status or pricing changes.",
    audience: "buyer",
  },
  {
    id: "faq-4",
    question: "How does VBYM help reduce time-wasting viewings?",
    answer:
      "Immersive VR-first tours help buyers self-qualify earlier, so agents only schedule in-person viewings with higher intent.",
    audience: "agent",
  },
  {
    id: "faq-5",
    question: "Can I control where my listings appear?",
    answer:
      "Yes. VBYM supports controlled distribution with clear visibility settings per listing.",
    audience: "agent",
  },
  {
    id: "faq-6",
    question: "Is my data shared with third parties?",
    answer:
      "VBYM only uses data to deliver the service. We never sell personal data and provide simple privacy controls.",
    audience: "general",
  },
  {
    id: "faq-7",
    question: "Is VBYM free for buyers and tenants?",
    answer:
      "Yes, VBYM is completely free for buyers and tenants. You can browse listings, take VR tours, save properties, and set alerts at no cost. Our service is funded by partner agencies.",
    audience: "buyer",
  },
];
