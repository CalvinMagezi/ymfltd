/** Text for the 3D concept model. Keep it consistent with lib/content/projects.ts and docs/FACTS.md. */

export const ZONE_SHORT: Record<string, string> = {
  forest: "Game reserve",
  wetland: "Wetland",
  golf: "Golf course",
  hotel: "Hotel",
  hospital: "Hospital",
  housing: "Homes",
  university: "Schools and university",
  commercial: "Town centre",
  arena: "Sports arena",
  agro: "Agro-industrial park",
  dairy: "Dairy farm",
  heritage: "Library and museum",
  bamboo: "Bamboo and hemp",
  ecolodge: "Eco-lodge",
  utilities: "Solar and utilities",
};

export const ZONE_INFO: Record<string, string> = {
  forest:
    "The wooded south of the land stays as forest: a game reserve and conservation area with a wildlife centre. The Foundation has applied to the Uganda Wildlife Authority for a wildlife tourism and recreation centre on about 127 acres of it.",
  wetland:
    "The valley floor stays as wetland, for water, papyrus and birds, crossed only by a boardwalk. Nothing is built on it. Its shape here follows the lowest ground in the terrain data.",
  golf:
    "An 18-hole course on the area that Hoima's physical development plan marks for golf, close to town and the road to Kampala. The clubhouse sits beside the hotel.",
  hotel:
    "A hotel built to five-star standard with conference rooms, overlooking the golf course and the wetland, for business, government and sports visitors.",
  hospital:
    "The 100-bed private hospital planned with Iproplan, a German healthcare planning firm. It sits at the town-side gate, so patients reach it from Hoima without crossing the rest of the town.",
  housing:
    "Apartments and town houses in a secure estate, for the people who will work at the hospital, schools, hotel and businesses. The streets nearest town come first.",
  university:
    "Primary and secondary schools, a university with law, agriculture and IT faculties, and a vocational training centre, next to Bunyoro University.",
  commercial:
    "Banks, shops, a food market and a cinema at the gateway nearest Hoima, serving the estate and the neighbourhoods around it.",
  arena:
    "A 10,000-seat sports arena with a motocross and rally course, for sports tourism and for Hoima's young athletes.",
  agro:
    "Food processing, packaging and storage, with the Centre for Agricultural Excellence, so farmers around Hoima can add value to what they grow.",
  dairy:
    "Running today, with about 126 Friesian cross cows producing milk. Next come yoghurt and butter, a biogas plant and a model farm where students learn.",
  heritage:
    "The family library, built from the books the founder and his family have collected, beside a museum of Bunyoro-Kitara heritage and a cultural village.",
  bamboo:
    "Bamboo for building, furniture and fodder, and a small plot for industrial hemp research, once Uganda's licences allow it.",
  ecolodge: "A green lodge for bird watching between the forest and the wetland, built from recycled materials and the town's own bamboo.",
  utilities: "A solar farm to power a green town, with water storage, a substation and open space.",
};

/** Which project page each zone links to. */
export const ZONE_PROJECT: Record<string, string> = {
  forest: "animal-conservation-project",
  wetland: "animal-conservation-project",
  golf: "golf-course-project",
  hotel: "hotel-project",
  hospital: "hospital-project",
  housing: "housing-project",
  university: "education-project",
  commercial: "shopping-center-project",
  arena: "sports-arena-project",
  agro: "agro-industrial-park",
  dairy: "agri-tourism-project",
  heritage: "library-project",
  bamboo: "bamboo-project",
  ecolodge: "eco-tourism-project",
  utilities: "technology-projects",
};

export const PHASES = [
  { name: "Today", note: "The dairy farm, the forest and the wetland. Everything else is still a plan." },
  { name: "Phase 1", note: "Anchor projects: hospital, golf course, hotel, the first homes and the solar farm." },
  { name: "Phase 2", note: "Schools and university, sports arena, library and museum, game reserve, eco-lodge, bamboo." },
  { name: "Phase 3", note: "The full town: agro-industrial park, town centre and the rest of the homes." },
];

export interface TourStop {
  title: string;
  zone: string | null;
  text: string;
  phaseDemo?: boolean;
}

export const TOUR: TourStop[] = [
  {
    title: "1,280 acres beside Hoima",
    zone: null,
    text: "The Foundation's land lies southeast of Hoima's city centre, between Kibati and Kinubi. This model shows one possible layout of the town on the real hills and valleys. It is a first draft for discussion, and the edges of the site are shown loosely, not as surveyed.",
  },
  {
    title: "A gateway on the town side",
    zone: "hospital",
    text: "The town centre, the hospital and the library sit closest to Hoima, so patients, shoppers and students arrive without crossing the rest of the town. The 100-bed hospital is being planned with Iproplan of Germany.",
  },
  {
    title: "Golf course and hotel",
    zone: "golf",
    text: "Hoima's physical development plan marks part of this land for golf. A hotel and conference centre overlooks the course and the wetland.",
  },
  {
    title: "The wetland stays",
    zone: "wetland",
    text: "The valley floor stays as wetland for water, papyrus and birds, crossed only by a boardwalk. Its shape here follows the lowest ground in the terrain data.",
  },
  {
    title: "Forest game reserve",
    zone: "forest",
    text: "About 300 acres of forest in the south become a conservation area and wildlife centre. The Foundation's application to the Uganda Wildlife Authority is being reviewed.",
  },
  {
    title: "From farm to factory",
    zone: "dairy",
    text: "The dairy farm already runs with about 126 cows. The plan adds yoghurt, butter and biogas, then an agro-industrial park where farmers around Hoima can process, pack and store their produce.",
  },
  {
    title: "Skills, sport and jobs",
    zone: "university",
    text: "Schools, a university and a vocational centre sit beside Bunyoro University. A 10,000-seat arena and a motocross course bring visitors and give young athletes a home.",
  },
  {
    title: "Built in phases",
    zone: null,
    phaseDemo: true,
    text: "Watch the town grow from today's farm and forest to the full plan. The timing of each phase depends on partners and funding, and every acre shown is a draft the family can change.",
  },
];
