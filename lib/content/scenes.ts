/**
 * Photoreal depictions made with Google Gemini (October 2026) from written briefs.
 * They are artist's impressions of what each place could look and feel like, not designs,
 * not photographs of the land, and not commitments. Always show the label.
 */
export type Scene = { src: string; alt: string; caption: string };

export const SCENES = {
  land: {
    src: "/images/scenes/land-morning.jpg",
    alt: "Morning over green hills with cattle grazing, a forest valley in mist and red-brick farm buildings in the foreground.",
    caption: "Morning on the land: pasture, the forest valley and the farm.",
  },
  aerial: {
    src: "/images/city/aerial.jpg",
    alt: "Aerial view at golden hour of a modern town on green hills: tree-lined curving streets of contemporary homes with green roofs and solar panels, mid-rise buildings, a golf course, a solar farm and a forested valley kept through the middle.",
    caption: "The whole town as it could look, with the forest and wetland kept through the middle.",
  },
  dairy: {
    src: "/images/city/dairy.jpg",
    alt: "Two Ugandan farm staff talk beside a large open-sided cow barn with a solar roof, a modern milking building and a biogas dome.",
    caption: "The dairy grown into a modern farm: a solar-roofed barn, a milking parlour and a biogas digester.",
  },
  agro: {
    src: "/images/city/agro-park.jpg",
    alt: "Modern food-processing and cold-storage buildings with solar roofs, a paved loading yard with refrigerated trucks and farmers delivering produce.",
    caption: "An agro-processing park where farmers from around Hoima sell more than raw produce.",
  },
  hospital: {
    src: "/images/city/hospital.jpg",
    alt: "A three-storey hospital of pale stone, brick and glass with timber sun fins, a green roof, a glass drop-off canopy with an ambulance and a landscaped healing garden.",
    caption: "A modern hospital campus at the town gate, with a healing garden.",
  },
  school: {
    src: "/images/city/campus.jpg",
    alt: "A university and school campus of brick, stone and glass buildings around a landscaped quad, with a solar-roofed walkway and students walking and cycling.",
    caption: "Schools and a university around a shaded, landscaped campus.",
  },
  library: {
    src: "/images/city/heritage-library.jpg",
    alt: "A circular library with a tall conical reed roof over a glowing glass drum, a reflecting pool and plaza, and traditional round thatched houses in a garden beside it.",
    caption: "The heritage library, inspired by the royal architecture of Bunyoro-Kitara, beside a cultural village.",
  },
  reserve: {
    src: "/images/city/reserve.jpg",
    alt: "Uganda kob graze in tall grass by a wetland with grey crowned cranes, below a modern timber visitor centre and a raised viewing deck where a ranger guides visitors.",
    caption: "The forest and wetland kept as a reserve, with a visitor centre and boardwalk.",
  },
  ecolodge: {
    src: "/images/city/ecolodge.jpg",
    alt: "Timber and glass cabins on stilts with planted roofs at the forest edge, linked by walkways to a deck over the wetland where guests relax at sunset.",
    caption: "An eco-lodge on stilts between the forest and the wetland.",
  },
  golf: {
    src: "/images/city/golf-hotel.jpg",
    alt: "A golf course with a lake and bunkers over rolling hills, with a low modern hotel of stone and glass and an infinity pool on the rise behind.",
    caption: "A championship golf course, with the hotel and conference centre on the rise.",
  },
  homes: {
    src: "/images/city/homes.jpg",
    alt: "A tree-lined street of modern townhouses and apartments in brick and white render with balconies and solar roofs, a walkway and cycle lane, and families walking.",
    caption: "Homes on quiet, tree-lined streets, close to school and work.",
  },
  town: {
    src: "/images/city/town-centre.jpg",
    alt: "A modern town centre street of mixed-use buildings with shops behind shaded colonnades, apartments above, a paved plaza and a covered market hall.",
    caption: "The town centre: shops, cafes and a covered market around a paved plaza.",
  },
  arena: {
    src: "/images/city/arena.jpg",
    alt: "A modern stadium with a sweeping white roof over a green pitch, a landscaped plaza where fans arrive, and a motocross track on the hill behind.",
    caption: "A sports arena for Hoima's athletes and visitors, with a motocross track beyond.",
  },
  solar: {
    src: "/images/city/solar-utilities.jpg",
    alt: "Rows of solar panels on a hillside beside a modern control building with a green roof, battery storage, a substation and a water tower, with the town beyond.",
    caption: "Solar power, storage and water for a town that runs on clean energy.",
  },
  hotel: {
    src: "/images/city/hotel.jpg",
    alt: "The arrival court of a modern hotel of pale stone, brick and glass under a deep timber roof, with a covered drop-off, a reflecting pool with palms and a glowing glass conference hall.",
    caption: "A five-star hotel and conference centre for business, government and sports visitors.",
  },
  museum: {
    src: "/images/city/museum.jpg",
    alt: "A modern museum pavilion of brick, stone and timber screens beside a courtyard with sculptures, next to a village of traditional round thatched houses where school groups and families visit.",
    caption: "A museum of Bunyoro-Kitara heritage beside a living cultural village.",
  },
  hemp: {
    src: "/images/city/fibre-research.jpg",
    alt: "Agronomists in white coats record data among trial plots of tall green fibre crops, beside a glass greenhouse and a brick research building with a solar roof.",
    caption: "A research station for fibre crops, where hemp would be studied once Uganda's licences allow it.",
  },
  bamboo: {
    src: "/images/city/bamboo.jpg",
    alt: "Tall bamboo groves beside an open-sided workshop built from bamboo beams with a solar roof, where craftspeople make furniture and building panels.",
    caption: "Bamboo grown on the land and worked into furniture and building panels.",
  },
} satisfies Record<string, Scene>;

export type SceneKey = keyof typeof SCENES;

/** Which picture tells each project's story best. Projects without one use the 3D concept view. */
export const PROJECT_SCENE: Record<string, SceneKey> = {
  "agri-tourism-project": "dairy",
  "agro-industrial-park": "agro",
  "bamboo-project": "bamboo",
  "hemp-project": "hemp",
  "hospital-project": "hospital",
  "education-project": "school",
  "library-project": "library",
  "museum-project": "museum",
  "animal-conservation-project": "reserve",
  "eco-tourism-project": "ecolodge",
  "golf-course-project": "golf",
  "hotel-project": "hotel",
  "sports-arena-project": "arena",
  "housing-project": "homes",
  "shopping-center-project": "town",
  "technology-projects": "solar",
};

export const sceneForProject = (slug: string): Scene | undefined => {
  const k = PROJECT_SCENE[slug];
  return k ? SCENES[k] : undefined;
};
