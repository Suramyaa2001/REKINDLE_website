/* =====================================================================
   REKINDLE site content that changes over time.
   To add an item, copy an existing object, paste it at the TOP of its
   list, and edit the fields. Dates use "YYYY-MM-DD" (or "YYYY-MM").
   ===================================================================== */

window.REKINDLE = {

  /* Google Form link for the Contact page. */
  contactForm: "https://forms.gle/SUPP9zczjbM3FBUx6",

  /* Set to true to show the "Wildfire data" page in the menu. */
  showWildfireData: false,

  /* Announcement bar shown under the menu on every page. Set to null to hide it. */
  banner: {
    label: "New",
    text: "Four institutions are working together on REKINDLE, a $2 million NSF project on cascading wildfire disasters",
    url: "news.html"
  },

  /* National Science Foundation awards. University at Buffalo is the lead institution and is listed first. */
  awards: [
    { inst: "University at Buffalo (lead institution)", id: "2623901", pi: "Sayanti Mukherjee", role: "Principal Investigator (Lead)" },
    { inst: "University of California, Berkeley", id: "2623902", pi: "Marta González", role: "Principal Investigator" },
    { inst: "Northeastern University", id: "2623903", pi: "Auroop R. Ganguly", role: "Principal Investigator" },
    { inst: "Pacific Northwest National Laboratory (award held by Battelle Memorial Institute)", id: "2623904", pi: "Andre Coleman", role: "Principal Investigator" }
  ],

  /* News & media. type is one of: Media, Grant, Event, Award, Paper, Talk */
  news: [
    {
      date: "2026-09-14", type: "Grant",
      title: "NSF funds REKINDLE, a $2 million project on wildfire resilience",
      text: "The project brings together Northeastern University, Pacific Northwest National Laboratory, University at Buffalo and University of California, Berkeley.",
      source: "University at Buffalo News",
      url: "https://www.buffalo.edu/news/releases/2026/09/university-at-buffalo-national-science-foundation-wildfire-resilience.html"
    },
    {
      date: "2026-09-14", type: "Media",
      title: "The Buffalo News covers REKINDLE",
      text: "Coverage of the $2 million National Science Foundation project on wildfire resilience.",
      source: "The Buffalo News",
      url: "https://buffalonews.com/news/community/article_fa603011-f3dc-5f8d-8df2-677245b37a94.html"
    },
    {
      date: "2026-08-31", type: "Media",
      title: "Northeastern University joins the REKINDLE project",
      text: "Northeastern University's College of Engineering describes its part in the $2 million NSF-funded effort to build resilience against wildfire and its cascading aftershocks.",
      source: "Northeastern University College of Engineering",
      url: "https://coe.northeastern.edu/news/northeastern-joins-2m-nsf-funded-effort-to-build-resilience-against-wildfire-and-its-cascading-aftershocks/"
    }
  ],

  /* Publications and other outputs that mention REKINDLE.
     kind is one of: paper, other  */
  outputs: [
    /* Example (delete the comment marks to use):
    { kind: "paper", year: 2027, title: "Paper title",
      authors: "A. Author, B. Author", venue: "Journal or conference",
      url: "https://doi.org/..." },
    */
  ],

  /* Students. Photos go in the site folder; set photo to the file name. */
  students: [
    { name: "Diyali Goswami", role: "PhD student", inst: "Northeastern University", photo: "photo-goswami.jpg" },
    { name: "Poulomee Roy", role: "PhD student, Industrial and Systems Engineering", inst: "University at Buffalo", photo: "photo-roy.jpg" },
    { name: "Suramyaa Sarkar", role: "PhD student, Industrial and Systems Engineering", inst: "University at Buffalo", photo: "photo-sarkar.jpg" }
  ],

  /* The four institutions. University at Buffalo is the lead institution and is listed first. */
  partners: [
    { name: "University at Buffalo", url: "https://www.buffalo.edu", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/University_at_Buffalo_logo.svg?width=400" },
    { name: "University of California, Berkeley", url: "https://www.berkeley.edu", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/University_of_California%2C_Berkeley_logo.svg?width=400" },
    { name: "Northeastern University", url: "https://www.northeastern.edu", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Northeastern_Wordmark.svg?width=400" },
    { name: "Pacific Northwest National Laboratory", url: "https://www.pnnl.gov", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/PNNL_CENTER_FullColorSMALL.jpg?width=400" }
  ],

  /* External collaborators: organizations that provided letters of collaboration.
     To add one: save the logo in assets/logos/ and copy a line below. */
  collaborators: [
    { name: "California Geological Survey, California Department of Conservation", logo: "assets/logos/ca-geological-survey.png" },
    { name: "Resolute Associates LLC", logo: "assets/logos/resolute-associates.png" },
    { name: "Natural Hazards Center", logo: "assets/logos/natural-hazards-center.png" },
    { name: "National Laboratory of the Rockies", logo: "assets/logos/national-laboratory-of-the-rockies.png" },
    { name: "Jet Propulsion Laboratory, California Institute of Technology", logo: "assets/logos/jpl.png" },
    { name: "Verisk", logo: "assets/logos/verisk.png" },
    { name: "Pyrologix", logo: "assets/logos/pyrologix.png" },
    { name: "Naval Postgraduate School", logo: "assets/logos/naval-postgraduate-school.png" },
    { name: "Cal Poly Pomona", logo: "assets/logos/cal-poly-pomona.png" },
    { name: "Montecito Fire Department", logo: "assets/logos/montecito-fire-department.png" }
  ]
};
