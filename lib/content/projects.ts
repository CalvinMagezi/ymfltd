/**
 * Project content for the YMF website.
 *
 * Source of truth: the family's own project texts (previously in the Sanity CMS),
 * the Project Overview presentation, the Project Breakdown, the 2025-2030
 * Development Strategy, the 2023 hospital concept note and YMF's 2024 letters to
 * the Uganda Wildlife Authority. Every factual claim here should trace to one of
 * those or to a cited public source. See docs/FACTS.md before adding a claim.
 */

export type Status = "Operating" | "Underway" | "In review" | "In planning" | "Research" | "Planned";

export type Theme = "health" | "land" | "nature" | "town";

export interface Project {
  slug: string;
  name: string;
  theme: Theme;
  status: Status;
  /** Phase in the concept model: 0 = today, 1-3 = build phases. */
  phase: 0 | 1 | 2 | 3;
  /** Zone in the 3D concept model where this project sits. */
  zone: string;
  summary: string;
  body: string[];
  /** Short, checkable milestones. */
  milestones?: { date: string; text: string }[];
}

export const THEMES: Record<Theme, { name: string; line: string }> = {
  health: { name: "Health and learning", line: "Care, schooling and the family's library and heritage." },
  land: { name: "Land and food", line: "Farming today, and the industry that adds value to it." },
  nature: { name: "Nature and visitors", line: "The forest, the wetland, and places to stay and play." },
  town: { name: "Town life", line: "Homes, shops, sport and the network that connects them." },
};

export const STATUS_NOTE: Record<Status, string> = {
  Operating: "Running today",
  Underway: "Work has started",
  "In review": "Application with a public authority",
  "In planning": "Partners and design being worked out",
  Research: "Being studied before any decision",
  Planned: "Part of the plan, waiting for partners and funding",
};

export const PROJECTS: Project[] = [
  {
    slug: "agri-tourism-project",
    name: "Kikwite dairy farm and agri-tourism",
    theme: "land",
    status: "Operating",
    phase: 0,
    zone: "dairy",
    summary: "The working dairy farm on the land today, growing into a model farm that teaches and welcomes visitors.",
    body: [
      "The Foundation already runs a dairy farm on the land, with a herd of about 126 Friesian cross cows, heifers and bulls. Today it sells milk.",
      "The next steps are to make yoghurt and butter, start a biogas plant from the farm's manure, and sell manure as fertiliser.",
      "Smaller livestock projects will sit beside the dairy: rabbits, pigeons, goats, turkeys and chickens. Together with medicinal and aromatic plants, they will turn the farm into a model farm where students and visitors can learn how the land is worked.",
    ],
  },
  {
    slug: "agro-industrial-park",
    name: "Agro-industrial park",
    theme: "land",
    status: "Planned",
    phase: 3,
    zone: "agro",
    summary: "Food processing, packaging and storage, with a Centre for Agricultural Excellence, so farmers around Hoima can sell more than raw produce.",
    body: [
      "The Foundation's 2025 to 2030 development strategy puts an agro-industrial park at the heart of the town: modern facilities for food processing, packaging and storage.",
      "Beside it, a Centre for Agricultural Excellence will carry out research, training and innovation in farming, and a vocational training centre will teach the skills the park and the wider town need.",
      "The aim is value addition. When produce from the farms around Hoima can be processed and stored close to where it is grown, more of its value stays with the people who grow it.",
    ],
  },
  {
    slug: "bamboo-project",
    name: "Bamboo",
    theme: "land",
    status: "Research",
    phase: 2,
    zone: "bamboo",
    summary: "Ten acres of bamboo, plus planting across the site, to supply building material, furniture and fodder.",
    body: [
      "Three members of the family belong to the Uganda Bamboo Association. The plan is to plant up to 10 acres with bamboo alone, and to grow more alongside the other projects.",
      "Bamboo grows quickly and is harvested in cycles. It can build beautiful buildings, including the planned eco-lodge, and supply a small workshop making furniture for the town, along with energy and feed for livestock.",
    ],
  },
  {
    slug: "hemp-project",
    name: "Industrial hemp",
    theme: "land",
    status: "Research",
    phase: 2,
    zone: "bamboo",
    summary: "Research into industrial hemp for textiles, building materials and food, and into the licences Uganda requires.",
    body: [
      "Industrial hemp is used for textiles, building materials, food and energy, and it is one of the fastest growing crops in the world.",
      "The Foundation is researching hemp before making any decision, including the licences that Uganda's law requires before anything is planted.",
    ],
  },
  {
    slug: "hospital-project",
    name: "100-bed hospital",
    theme: "health",
    status: "In planning",
    phase: 1,
    zone: "hospital",
    summary: "A modern private hospital at the town-side gate, planned with the German healthcare planners Iproplan.",
    body: [
      "The COVID-19 pandemic showed how far behind Uganda's medical services can be. The Foundation wants to help close that gap with state-of-the-art facilities and well-trained doctors, close to home for the people of Hoima.",
      "In September 2023 the Foundation set out a 100-bed private hospital in a concept note to the Ministry of Health, planned in partnership with Iproplan, a German healthcare planning firm. The Foundation provides the land, permits and approvals, and Iproplan the planning, design and equipping.",
      "Plans include e-medicine, and referral packages with partner hospitals abroad for treatment that is not yet available locally. The hospital will work hand in hand with the Byron Magezi Sickle Cell Foundation, a non-profit started by the family.",
    ],
    milestones: [{ date: "September 2023", text: "Concept note for a 100-bed private hospital submitted to the Ministry of Health." }],
  },
  {
    slug: "education-project",
    name: "Schools, university and vocational centre",
    theme: "health",
    status: "Planned",
    phase: 2,
    zone: "university",
    summary: "High-quality, affordable education from primary school to university, with faculties of law, agriculture and IT.",
    body: [
      "The Foundation intends to build high-quality, affordable schools all the way from primary to university, starting with a university that has faculties of law, agriculture and IT. Education is the motivation, not making money from parents and families.",
      "Teaching will be modern and practical. Alongside academic subjects, students will learn about the things that shape life in Hoima today: oil and gas, diet and health, taxation, and managing time and money.",
      "The campus sits next to Bunyoro University, so the two can share students, staff and ideas. International students will be welcome too.",
    ],
  },
  {
    slug: "library-project",
    name: "Library",
    theme: "health",
    status: "Underway",
    phase: 2,
    zone: "heritage",
    summary: "A library built from the books the founder, his children and grandchildren have collected, in print and online.",
    body: [
      "The founder, Mr Yesero Mugenyi, ran his own law firm in Kampala and collected a large library, mostly of law books. He was the pillar of his family's education and loved to read.",
      "Five of his six children became lawyers, and one became a judge. His youngest daughter went into the airline industry and became Country Manager for four airlines.",
      "Books gathered by him, his children and his grandchildren are already being collected. The library will have a law section with past cases, a history section, and a digital collection with audiobooks, in a building of several floors that also goes below ground.",
    ],
  },
  {
    slug: "museum-project",
    name: "Museum and cultural village",
    theme: "health",
    status: "Planned",
    phase: 2,
    zone: "heritage",
    summary: "A museum of Bunyoro-Kitara heritage beside the library, with a cultural village where visitors can stay and learn.",
    body: [
      "The founder is a Mubiito, a prince of the royal clan of Bunyoro-Kitara. The museum will hold photographs, artefacts and stories of Bunyoro's history and culture, gathered with help from the whole family.",
      "Next to it, a cultural tourism village will share Uganda's heritage and hospitality with visitors. An online museum will come first, so the collection can grow before the building is built.",
    ],
  },
  {
    slug: "animal-conservation-project",
    name: "Forest game reserve and wildlife centre",
    theme: "nature",
    status: "In review",
    phase: 2,
    zone: "forest",
    summary: "About 300 acres of forest kept as a conservation area, with a wildlife tourism and recreation centre.",
    body: [
      "The land includes about 300 acres of forest. It will be closed off as a game reserve and conservation area, and the money it earns from visitors will support conservation.",
      "In October 2024 the Foundation applied to the Uganda Wildlife Authority for a wildlife use right for tourism and recreation, for a holding ground of about 127 acres. Animals proposed include zebra, eland, waterbuck, bushbuck, Uganda kob, giraffe, Jackson's hartebeest, impala, warthog, crested crane and peacocks.",
      "The Authority has asked for detailed care plans for each species and a design of the facility. The Foundation is preparing both.",
    ],
    milestones: [
      { date: "October 2024", text: "Application to the Uganda Wildlife Authority for a wildlife tourism and recreation centre." },
      { date: "February 2025", text: "Uganda Wildlife Authority requests species care plans and a facility design." },
    ],
  },
  {
    slug: "eco-tourism-project",
    name: "Green eco-lodge",
    theme: "nature",
    status: "Planned",
    phase: 2,
    zone: "ecolodge",
    summary: "A lodge for bird watching between the forest and the wetland, built from recycled materials and the town's own bamboo.",
    body: [
      "A green lodge will sit near the game reserve for eco-tourism and bird watching. Uganda is home to more than 1,000 bird species.",
      "The lodge will promote recycling from the start. It will be built mainly from recycled materials and from what the Foundation grows itself, such as bamboo, and each room will have a bird guide and a watching station.",
    ],
  },
  {
    slug: "golf-course-project",
    name: "18-hole golf course",
    theme: "nature",
    status: "Planned",
    phase: 1,
    zone: "golf",
    summary: "A championship course on the land that Hoima's physical development plan already marks for golf, near the road to Kampala.",
    body: [
      "Hoima's physical development plan marks an area for a golf course, and that area lies within the Foundation's land. The course will be close to town and near the road to Kampala.",
      "A five-star hotel will stand next to it, so locals and visitors can enjoy a quiet, high-quality golfing escape. The Foundation will work with an experienced golf course developer.",
    ],
  },
  {
    slug: "hotel-project",
    name: "Five-star hotel and conference centre",
    theme: "nature",
    status: "Planned",
    phase: 1,
    zone: "hotel",
    summary: "A hotel built to five-star standard beside the golf course, with conference rooms for business and government.",
    body: [
      "With a new international airport near Hoima, more visitors are coming. The Foundation intends to offer the best hospitality, with well-trained staff from the area.",
      "The hotel will sit beside the golf course and will include conference facilities, so business people, oil and gas investors and officials can meet and plan in Hoima. The Foundation will approach established international hotel brands to run it.",
    ],
  },
  {
    slug: "sports-arena-project",
    name: "Sports arena and motocross track",
    theme: "town",
    status: "Planned",
    phase: 2,
    zone: "arena",
    summary: "A 10,000-seat arena and a motocross and rally course, for sports tourism and for Hoima's young athletes.",
    body: [
      "The Foundation aims to build a 10,000-seat sports arena with modern design, so Hoima can host major sporting events. It will bring visitors and inspire young people in the community to reach for the top.",
      "Alongside the arena, a motocross and rally course is planned with an upcoming track in Kenya, so local riders can take part in East African motocross events.",
    ],
  },
  {
    slug: "housing-project",
    name: "Homes: apartments and town houses",
    theme: "town",
    status: "Planned",
    phase: 1,
    zone: "housing",
    summary: "A secure estate of apartments and town houses for the people who will work in the town.",
    body: [
      "Apartments and town houses will be built within a secure estate, for the people who will work at the hospital, schools, hotel and businesses of the town.",
      "The homes will combine modern technology with good interior design, built for this generation and the next.",
    ],
  },
  {
    slug: "shopping-center-project",
    name: "Town centre and shopping",
    theme: "town",
    status: "Planned",
    phase: 3,
    zone: "commercial",
    summary: "Banks, shops, a food market and a cinema at the gateway nearest Hoima.",
    body: [
      "A town centre will bring banks, clothing stores at every price, a food market, a cinema and free wifi to one place.",
      "It will be a one-stop shop for everyone living in the estate and nearby, with delivery services and the full range of everyday shopping.",
    ],
  },
  {
    slug: "technology-projects",
    name: "A connected, solar-powered town",
    theme: "town",
    status: "Underway",
    phase: 1,
    zone: "utilities",
    summary: "Solar power for every project and a shared digital network for farming, water, security and transport.",
    body: [
      "Solar power will be used across all projects, to make this a green satellite town. A shared digital network will support farming, communication, security, water, electricity and transport.",
      "The goal is to build on the old ways of farming and living, not replace them, so that everyone in the town has equal access to new technology and to a simple way of life. New technology will be adopted only after its effects on health and the environment have been carefully considered.",
      "The first pieces are already here: this website and the 3D concept model of the town, built by the family.",
    ],
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const projectsByZone = (zone: string) => PROJECTS.filter((p) => p.zone === zone);
