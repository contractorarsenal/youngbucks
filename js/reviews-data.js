/* ============================================================
   YOUNG BUCKS — centralized Google review data source.
   Single source of truth for every testimonial shown anywhere
   on the site. Add new real reviews here only — never hardcode
   a quote directly into a page again.

   Each entry: { name, initials, quote, tags, featured }
   - tags: lowercase category labels used to select relevant
     reviews per page (see YB_pickReviews in main.js).
   - featured: true marks reviews strong/varied enough for the
     homepage carousel.

   Quotes are verbatim real Google reviews (only minor spelling/
   punctuation cleanup applied) — never invented or rewritten.
   Currently 16 real reviews are on file; this array is designed
   to be extended in place with the remaining reviews from the
   full 52-review dataset once supplied, with no other code or
   markup changes required.
   ============================================================ */
window.YB_REVIEWS_ALL = [
  {
    name: "Anahi Devereaux", initials: "AD",
    quote: "Young Bucks has done my yard, taken trees down, and blown out my sprinklers for many years. They always do good work. I will continue to use their services! They're truly the best in this valley!!",
    tags: ["sprinkler", "irrigation", "tree", "removal", "repeat", "landscaping"],
    featured: true
  },
  {
    name: "David Picha", initials: "DP",
    quote: "Had some irrigation work done by Young Bucks and working with Oscar was amazing. Would recommend for any and all irrigation needs.",
    tags: ["irrigation", "professionalism"],
    featured: true
  },
  {
    name: "Chris Gilman", initials: "CG",
    quote: "They did a fantastic job of trimming two long-neglected trees in my back yard. Complete cleanup and super-nice people who did the work. I plan on asking them to do more in the future.",
    tags: ["tree", "trimming", "cleanup"],
    featured: true
  },
  {
    name: "traveling Cat", initials: "TC",
    quote: "Wonderful people, great communication! Finished the project before projected within my budget!",
    tags: ["communication", "pricing", "professionalism"],
    featured: true
  },
  {
    name: "Rocio", initials: "R",
    quote: "Great service and very professional. They did an excellent job on my landscaping and everything looks clean and beautiful. Highly recommend!",
    tags: ["landscaping", "professionalism"],
    featured: true
  },
  {
    name: "Chelan Valley Handyman", initials: "CV",
    quote: "Carlos and his team did an awesome job taking down two very difficult trees, on difficult terrain. They were very professional, worked hard, and were friendly and pleasant to be around.",
    tags: ["tree", "removal", "difficult-terrain", "professionalism"],
    featured: true
  },
  {
    name: "Julie Hart", initials: "JH",
    quote: "We have had Young Bucks do work for us several times over the past few years. The bid is always complete, the jobs are done perfectly and they do wonderful clean up.",
    tags: ["repeat", "cleanup", "pricing", "professionalism"],
    featured: true
  },
  {
    name: "Lorenzo Gomez", initials: "LG",
    quote: "Highly recommend Young Bucks, thank you for being fair priced and taking care of my properties. Fast and efficient. Thank you guys again.",
    tags: ["pricing", "professionalism"],
    featured: true
  },
  {
    name: "DeAnn Howie", initials: "DH",
    quote: "OMG!!! These guys are amazing!!! Been doing my lawn service for years! Put in irrigation on the home I am living in now...",
    tags: ["irrigation", "landscaping", "repeat"]
  },
  {
    name: "lefty Leal", initials: "LL",
    quote: "Great service, fast workers, highly recommend.",
    tags: ["professionalism"]
  },
  {
    name: "Rangel Santillan", initials: "RS",
    quote: "Excellent service and good clean up after work.",
    tags: ["cleanup", "professionalism"]
  },
  {
    name: "Peter Dauer", initials: "PD",
    quote: "I had Young Bucks remove 3 gnarly Cypress trees. Carlos and his crew did a great job and they left the job site neater than when they arrived. I would highly recommend them for any tree work. Thank you!",
    tags: ["tree", "removal", "cleanup", "professionalism"]
  },
  {
    name: "Samantha D", initials: "SD",
    quote: "Great group of guys to work with. They were friendly, helpful, and efficient. I had them top an 80ft tree next to power-lines and a trailer, with no problems. Would highly recommend their services.",
    tags: ["tree", "trimming", "difficult-terrain", "hazardous", "professionalism"]
  },
  {
    name: "Makenzie Mort", initials: "MM",
    quote: "Young Bucks did an awesome job. They came over to my house and cut down a big tree for me and did an amazing job putting in my underground sprinklers.",
    tags: ["tree", "removal", "sprinkler", "irrigation"]
  },
  {
    name: "Tim Henry", initials: "TH",
    quote: "Great group of guys really getting it done. Showed up on time and cleaned up well.",
    tags: ["cleanup", "professionalism"]
  },
  {
    name: "Pam Ervin", initials: "PE",
    quote: "Carlos and co-worker. Very polite, knowledgeable men. Did a great job trimming my trees. A satisfied customer.",
    tags: ["tree", "trimming", "professionalism"]
  }
];
