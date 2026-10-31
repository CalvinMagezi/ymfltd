/** Site-wide facts. Every line here is listed with its source in docs/FACTS.md. */

export const CONTACT = {
  person: "Ada Mugenyi, Managing Director",
  email: "ada@ymfltd.com",
  phone: "+256 775 599 533",
  address: "Plot 26, Old Toro Road, Hoima, Uganda",
};

export const KEY_FACTS = [
  { value: "1,280", unit: "acres", text: "Two square miles of land southeast of Hoima's city centre, between Kibati and Kinubi." },
  { value: "126", unit: "cows", text: "The Kikwite dairy farm is running on the land today and selling milk." },
  { value: "300", unit: "acres", text: "Of forest kept for a game reserve and conservation area." },
  { value: "16", unit: "projects", text: "From a hospital and schools to food processing, planned in phases." },
];

export interface FamilyMember {
  name: string;
  title: string;
  img: string;
}

/** Names and titles as the family listed them in 2022, with one correction (see docs/FACTS.md). */
export const FAMILY: FamilyMember[] = [
  { name: "Ada Mugenyi", title: "Managing Director", img: "/images/team/face/mom.jpg" },
  { name: "Mary Mugenyi", title: "Director", img: "/images/team/face/kaka.jpg" },
  { name: "Ana Mugenyi", title: "Judge of the High Court", img: "/images/team/face/ana-mugenyi.jpg" },
  { name: "Ham Mugenyi", title: "Lawyer, Chairman of the Uganda Development Corporation Board", img: "/images/team/face/ham-mugenyi.jpg" },
  { name: "Yese Mugenyi", title: "Lawyer", img: "/images/team/face/yese-mugenyi.jpg" },
  { name: "Asa Mugenyi", title: "Lawyer, former Chairperson of the Tax Appeals Tribunal", img: "/images/team/face/asa-mugenyi.jpg" },
];

export const TIMELINE = [
  { date: "21 October 2011", text: "Yesero Mugenyi Foundation Limited is incorporated in Uganda." },
  { date: "Running today", text: "The Kikwite dairy farm on the land sells milk from a herd of about 126 Friesian cross cattle." },
  { date: "September 2023", text: "A concept note for a 100-bed private hospital, planned with Iproplan of Germany, goes to the Ministry of Health." },
  { date: "October 2024", text: "The Foundation applies to the Uganda Wildlife Authority for a wildlife tourism and recreation centre in the forest." },
  { date: "2025", text: "The family sets out a development strategy for 2025 to 2030." },
  { date: "October 2026", text: "A first 3D concept model of New Kikwite Town is built on the real terrain of the land." },
];

export interface SourcedFact {
  figure: string;
  label: string;
  text: string;
  source: { title: string; url: string; date: string };
}

/** Checked 31 October 2026. Update the date and figures together. */
export const HOIMA_FACTS: SourcedFact[] = [
  {
    figure: "143,304",
    label: "people in Hoima City",
    text: "Up from 100,099 in 2014. Hoima District, around the city, has 257,544 more.",
    source: {
      title: "UBOS, National Population and Housing Census 2024, Bunyoro sub-region profiles",
      url: "https://statistics.ubos.org/nphc/reports/Bunyoro-Sub-Region-Census-2024-Profile-Report.pdf",
      date: "June 2025",
    },
  },
  {
    figure: "Jan 2027",
    label: "Kabalega airport opens",
    text: "The first passenger aircraft landed in September 2026. Full commercial operations are scheduled for January 2027, on a 3.5 km runway in Kabaale.",
    source: {
      title: "ATTA, Kabalega International Airport receives first passenger aircraft",
      url: "https://atta.travel/resource/kabalega-international-airport-receives-first-passenger-aircraft-ahead-of-january-2027-opening.html",
      date: "1 October 2026",
    },
  },
  {
    figure: "20,000",
    label: "seats at Hoima City Stadium",
    text: "Built for the 2027 Africa Cup of Nations. It hosted its first international match on 29 September 2026.",
    source: {
      title: "Nile Post via AllAfrica, Hoima City Stadium hosts Uganda v Libya",
      url: "https://allafrica.com/stories/202609300375.html",
      date: "30 September 2026",
    },
  },
  {
    figure: "1.65 bn",
    label: "barrels of recoverable oil",
    text: "Out of about 6.65 billion barrels in place in the Albertine Graben. First oil from Kingfisher is expected by the end of 2026, with exports in 2027.",
    source: {
      title: "UBC, Petroleum Authority of Uganda revises reserves",
      url: "https://ubc.go.ug/?p=20723",
      date: "20 November 2025",
    },
  },
  {
    figure: "267",
    label: "beds at the regional referral hospital",
    text: "Hoima Regional Referral Hospital serves about 3.5 million people across Bunyoro.",
    source: {
      title: "Daily Monitor, Hoima referral hospital gets new intensive care unit",
      url: "https://www.monitor.co.ug/uganda/news/national/hoima-referral-hospital-gets-new-intensive-care-unit-4881324",
      date: "7 January 2025",
    },
  },
  {
    figure: "17,000",
    label: "Ugandans working directly in oil",
    text: "Across the country, 89% of the oil sector's direct workforce. The Tilenga project alone has employed more than 10,500 Ugandans since 2021.",
    source: {
      title: "The Independent, Historic national content gains set stage for production boom",
      url: "https://www.independent.co.ug/historic-national-content-gains-set-stage-for-production-boom",
      date: "9 December 2025",
    },
  },
];

export const HOIMA_MORE = [
  {
    text: "The Kampala to Hoima road is being rebuilt. The 145 km Busunju to Hoima section was 40% complete in October 2026.",
    source: {
      title: "Daily Monitor, Kampala to Hoima highway works 40% complete",
      url: "https://www.monitor.co.ug/uganda/news/national/kampala-hoima-highway-works-40-complete-as-govt-plans-shs175b-advance-5632030",
      date: "14 October 2026",
    },
  },
  {
    text: "Hotels in Hoima are expanding ahead of the Africa Cup of Nations. Kabalega Resort is growing from 102 to 259 rooms.",
    source: {
      title: "Daily Monitor, Hotel investors in Hoima and Masindi prepare for 2027 AFCON",
      url: "https://www.monitor.co.ug/uganda/news/insight/hotel-investors-in-hoima-masindi-prepare-for-2027-afcon-5548306",
      date: "2026",
    },
  },
  {
    text: "A US$4 billion, 60,000 barrel a day oil refinery is being developed at Kabaale Industrial Park. The government hopes to commission it within about two to four years.",
    source: {
      title: "S&P Global, Interview with Uganda's new energy minister",
      url: "https://www.spglobal.com/energy/en/news-research/latest-news/refined-products/102726-interview-ugandas-new-energy-minister-eyes-infrastructure-push-beyond-first-oil",
      date: "27 October 2026",
    },
  },
];

export const HOIMA_HERITAGE = [
  "The palace of the Omukama of Bunyoro-Kitara",
  "The Mparo Tombs of Omukama Kabalega",
  "Katasiha Fort, 2 km from town on the Butiaba road",
  "Lake Albert, about 20 miles away",
  "Murchison Falls National Park, under three hours by road",
];
