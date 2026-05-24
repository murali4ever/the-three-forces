/** Per-chapter Kid's Corner tips and extra diagrams (one tip per page, no repeats). */
const ChapterMeta = {
  tips: {
    cover:
      "This is the title page — the name of the book and what it's about, before the story starts.",
    preamble:
      "This story uses a traveler who wakes up confused — like you might feel when learning something totally new!",
    introduction:
      "The room talks without a person! That's electricity and computers working together — lights and smart speakers.",
    "why-these-three":
      "Many inventions matter! This book picks three you use every day because they stack together — energy, stuff, and smart tools — and tell the same story.",
    "electricity-1":
      "Electricity is like an invisible river in wires. It can travel far from where it's made — to your lamp or phone.",
    "electricity-2":
      "Lightning is electricity in the sky. Scientists learned tiny particles called electrons move through metal wires.",
    "electricity-3":
      "A generator spins and makes electricity. Sun, wind, water, and heat can all be turned into the same kind of power.",
    "electricity-4":
      "One kind of power (electricity) can run many machines — that's why it spread everywhere, like a universal language.",
    "electricity-5":
      "The power grid is a giant web of wires connecting power plants to homes — like roads, but for energy.",
    "electricity-6":
      "Factories used to need one big steam engine for everything. Now each machine can have its own electric motor.",
    "electricity-7":
      "Electricity is useful but dangerous — water and bare wires don't mix. Safety rules exist for good reasons.",
    "electricity-8":
      "People call electricity a 'new fire' because it changed cooking, heating, and work as much as fire once did.",
    "plastic-1":
      "Before plastic, cups were glass or metal, bags were cloth, and toys were often wood — nothing like today!",
    "plastic-2":
      "Plastic starts as oil from deep underground. Chemists change it into pellets that factories melt and mold.",
    "plastic-3":
      "Plastic can be hard like a helmet or soft like a straw — scientists tweak the recipe for each job.",
    "plastic-4":
      "After World War II, plastic products exploded — bags, bottles, and packaging showed up everywhere fast.",
    "plastic-5":
      "Plastic saved lives in hospitals — syringes, gloves, and sterile packaging stay clean and light.",
    "plastic-6":
      "Stores filled with cheap plastic goods — colorful, light, and easy to replace when they broke.",
    "plastic-7":
      "Plastic lasts a very long time. A bottle can stay in nature for hundreds of years if not recycled.",
    "plastic-8":
      "Big companies make plastic pellets and sell them to factories that shape them into products.",
    "plastic-9":
      "We are the consumers — we buy, use, and throw away. Our choices affect how much plastic piles up.",
    "plastic-10":
      "Some say we live in a 'plastic age' — plastic is everywhere, like stone tools were everywhere long ago.",
    "ai-1":
      "You already use AI when your phone guesses your next word or recommends a video — it's been around a while!",
    "ai-2":
      "New AI tools surprised people by writing essays and drawing pictures — faster than many expected.",
    "ai-3":
      "The book compares AI to electricity: one new force that many inventions can plug into.",
    "ai-4":
      "It's normal to feel worried — every big invention (fire, cars, internet) scared people at first too.",
    "ai-5":
      "Tech companies build AI models — huge programs trained on enormous amounts of text and data.",
    "ai-6":
      "Smart users ask: Is this answer true? Who made this? Should I share private information?",
    "ai-7":
      "AI is changing jobs quietly — some tasks get automated while new kinds of work appear.",
    "ai-8":
      "Electricity, plastic, and AI all followed a pattern: wonder → boom → worry → learn to adapt.",
    "ai-9":
      "Some careers will change a lot. Learning to work *with* AI may matter more than fighting it.",
    "ai-10":
      "Three revolutions: electricity freed muscle, plastic freed materials, AI may free routine thinking. Same big question each time: use it wisely?",
    about:
      "This book was written by a human with AI help — the human chose the ideas and the story direction.",
  },

  /** Optional inline diagram for specific chapters only */
  diagram(chapterId) {
    if (chapterId === "electricity-1") {
      return { title: "How power travels", render: () => Illustrations.riverDiagram() };
    }
    if (chapterId === "ai-10") {
      return { title: "Three revolutions at a glance", render: () => Illustrations.compareRevolutions() };
    }
    return null;
  },

  tip(chapterId) {
    return this.tips[chapterId] || null;
  },
};
