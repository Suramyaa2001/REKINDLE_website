/* =====================================================================
   REKINDLE site content that changes over time.
   To add an item, copy an existing object, paste it at the TOP of its
   list, and edit the fields. Dates use "YYYY-MM-DD" (or "YYYY-MM").
   ===================================================================== */

window.REKINDLE = {

  /* Announcement bar shown above the menu on every page.
     Set to null to hide it. */
  banner: {
    label: "New",
    text: "UB leads a $2 million NSF project, REKINDLE, to help communities prepare for cascading wildfire disasters",
    url: "https://www.buffalo.edu/news/releases/2026/09/university-at-buffalo-national-science-foundation-wildfire-resilience.html"
  },

  /* News & media. type is one of: Media, Grant, Event, Award, Paper, Talk */
  news: [
    {
      date: "2026-09-14", type: "Grant",
      title: "UB leads $2M NSF project on wildfire resilience",
      text: "REKINDLE will build AI-powered tools for cascading wildfire hazards, with UC Berkeley, Northeastern and PNNL.",
      source: "UB News",
      url: "https://www.buffalo.edu/news/releases/2026/09/university-at-buffalo-national-science-foundation-wildfire-resilience.html"
    },
    {
      date: "2026-09-14", type: "Media",
      title: "The Buffalo News covers REKINDLE",
      text: "UB to lead the $2 million NSF project on wildfire resilience.",
      source: "Buffalo News",
      url: "https://buffalonews.com/news/community/article_fa603011-f3dc-5f8d-8df2-677245b37a94.html"
    },
    {
      date: "2026-09", type: "Media",
      title: "Northeastern joins the REKINDLE team",
      text: "Northeastern's College of Engineering on the four-institution effort.",
      source: "Northeastern",
      url: "https://coe.northeastern.edu/news/northeastern-joins-2m-nsf-funded-effort-to-build-resilience-against-wildfire-and-its-cascading-aftershocks/"
    }
  ],

  /* Publications, presentations and other outputs that mention REKINDLE.
     kind is one of: paper, presentation, other  */
  outputs: [
    /* Example (delete the comment marks to use):
    { kind: "paper", year: 2027, title: "Paper title",
      authors: "A. Author, B. Author", venue: "Journal or conference",
      url: "https://doi.org/..." },
    { kind: "presentation", year: 2027, title: "Talk or poster title",
      authors: "A. Author", venue: "Conference, City",
      url: "https://link-to-slides" },
    */
  ],

  /* Student and staff researchers. Add photo: "images/name.jpg" if you have one. */
  students: [
    /* { name: "First Last", role: "PhD student", inst: "University at Buffalo" }, */
  ]
};
