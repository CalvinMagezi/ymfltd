/**
 * Photoreal depictions made with Google Gemini (October 2026) from written briefs.
 * They are artist's impressions of what each place could feel like, not designs,
 * not photographs of the land, and not commitments. Always show the label.
 */
export type Scene = { src: string; alt: string; caption: string };

export const SCENES = {
  land: {
    src: "/images/scenes/land-morning.jpg",
    alt: "Morning over green hills with cattle grazing, a forest valley in mist and red-brick farm buildings in the foreground.",
    caption: "Morning on the land: pasture, the forest valley and the farm.",
  },
  dairy: {
    src: "/images/scenes/dairy.jpg",
    alt: "A farmer leads a black-and-white cow into an open milking shed while a woman pours milk into steel cans beside a domed biogas digester.",
    caption: "The dairy as it could grow: a clean milking shed, steel cans and a biogas digester.",
  },
  agro: {
    src: "/images/scenes/agro-park.jpg",
    alt: "Farmers deliver milk by bicycle and produce by pickup to a brick collection centre with a weighing scale and a refrigerated truck.",
    caption: "An agro-processing hub where farmers from the area bring milk and produce.",
  },
  hospital: {
    src: "/images/scenes/hospital.jpg",
    alt: "A two-storey red-brick hospital with solar panels and a shaded courtyard where patients and staff walk.",
    caption: "A district-scale hospital in fired brick around a shaded courtyard.",
  },
  school: {
    src: "/images/scenes/school.jpg",
    alt: "Students walk along brick paths between two-storey teaching blocks while a group studies together under a large tree.",
    caption: "A school and college campus with room to learn outdoors.",
  },
  library: {
    src: "/images/scenes/heritage-library.jpg",
    alt: "A round reading hall with a tall thatched roof beside smaller round thatched houses, where an elder tells a story to a ring of children.",
    caption: "The heritage library and cultural village, built in the Banyoro tradition.",
  },
  reserve: {
    src: "/images/scenes/reserve.jpg",
    alt: "Uganda kob graze in tall grass beside a wetland where two grey crowned cranes stand, watched by a ranger and visitors from a timber platform.",
    caption: "The forest and wetland kept as a reserve for wildlife, water and visitors.",
  },
  ecolodge: {
    src: "/images/scenes/ecolodge.jpg",
    alt: "Thatched timber cabins on stilts at the edge of a forest, with a boardwalk across a wetland where visitors walk with a guide.",
    caption: "An eco-lodge on stilts at the forest edge, with a boardwalk over the wetland.",
  },
  golf: {
    src: "/images/scenes/golf-hotel.jpg",
    alt: "Golfers walk a fairway over rolling hills towards a lake, with a low red-brick hotel on the rise behind.",
    caption: "A golf course over the hills, with the hotel on the rise behind it.",
  },
  homes: {
    src: "/images/scenes/homes.jpg",
    alt: "A residential street of brick family homes with gardens and solar street lights, children walking home in school uniforms.",
    caption: "Family homes on a quiet street, a short walk from school and work.",
  },
  town: {
    src: "/images/scenes/town-centre.jpg",
    alt: "A town square with arcaded brick shopfronts and an open timber market hall where traders sell matooke, fruit and vegetables.",
    caption: "The town centre: shops under deep verandas and a covered market.",
  },
} satisfies Record<string, Scene>;

export type SceneKey = keyof typeof SCENES;

/** Which picture tells each project's story best. Projects without one use the 3D concept view. */
export const PROJECT_SCENE: Record<string, SceneKey> = {
  "agri-tourism-project": "dairy",
  "agro-industrial-park": "agro",
  "hospital-project": "hospital",
  "education-project": "school",
  "library-project": "library",
  "museum-project": "library",
  "animal-conservation-project": "reserve",
  "eco-tourism-project": "ecolodge",
  "golf-course-project": "golf",
  "hotel-project": "golf",
  "housing-project": "homes",
  "shopping-center-project": "town",
};

export const sceneForProject = (slug: string): Scene | undefined => {
  const k = PROJECT_SCENE[slug];
  return k ? SCENES[k] : undefined;
};
