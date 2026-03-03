// Navigation menu items - REORDERED per user specifications
export const MENU_ITEMS = [
  { title: "Home", href: "/", submenu: [] },
  {
    title: "Our Company",
    href: "#",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "Offices", href: "/offices" },
    ],
  },
  { title: "Philanthropy & Impact", href: "/phil-impact", submenu: [] },
  { title: "Internal News", href: "/internal-news", submenu: [] },
  {
    title: "AI Initiatives",
    href: "#",
    submenu: [
      { label: "AI Services", href: "/ai-services" },
      { label: "AI Projects", href: "/ai-projects" },
    ],
  },
  {
    title: "What We Offer",
    href: "#",
    submenu: [
      { label: "Type A-Data Servicing", href: "/data-service" },
      { label: "Type B-Horizontal LLM Data", href: "/horizontal-llm-data" },
      { label: "Type C-Vertical LLM Data", href: "/vertical-llm-data" },
      { label: "Type D-AIGC", href: "/aigc" },
    ],
  },
  { title: "Careers", href: "/careers", submenu: [] },
];

// Footer links organization
export const FOOTER_LINKS = {
  Company: ["Home", "AI Initiatives", "Our Company", "What We Offer"],
  Impact: ["Philanthropy & Impact", "Careers", "Contact Us"],
  Legal: ["Privacy Policy", "Cookie Policy", "Terms and Conditions"],
  Connect: [],
};

// Internal page routes for footer
export const INTERNAL_LINKS = {
  Home: "/",
  "AI Initiatives": "/ai-services",
  "Our Company": "/about",
  "What We Offer": "/ai-services",
  "Philanthropy & Impact": "/phil-impact",
  Careers: "/careers",
  "Contact Us": "/contact-us",
  "Privacy Policy": "/privacy-policy",
  "Cookie Policy": "/cookie-policy",
  "Terms and Conditions": "/terms-conditions",
};

// Social media links for footer
export const CONNECT_LINKS = {
  LinkedIn:
    "https://www.linkedin.com/company/lifewood-data-technology-ltd./posts/?feedView=all",
  Facebook: "https://www.facebook.com/LifewoodPH",
  Instagram: "https://www.instagram.com/lifewood_official/?hl=af",
  YouTube: "https://www.youtube.com/@LifewoodDataTechnology",
};

// Office regions for Offices page
export const OFFICE_REGIONS = [
  {
    id: "all",
    label: "All Regions",
    count: 20,
    mapFocus: "Global",
    center: [15, 22],
    zoom: 2,
  },
  {
    id: "africa",
    label: "Africa",
    count: 2,
    mapFocus: "Africa",
    center: [4, 20],
    zoom: 3,
  },
  {
    id: "asia",
    label: "Asia",
    count: 10,
    mapFocus: "Asia",
    center: [24, 94],
    zoom: 3,
  },
  {
    id: "oceania",
    label: "Oceania",
    count: 1,
    mapFocus: "Oceania",
    center: [-23, 134],
    zoom: 4,
  },
  {
    id: "europe",
    label: "Europe",
    count: 3,
    mapFocus: "Europe",
    center: [52, 12],
    zoom: 4,
  },
  {
    id: "americas",
    label: "Americas",
    count: 2,
    mapFocus: "Americas",
    center: [14, -78],
    zoom: 3,
  },
  {
    id: "hub",
    label: "Regional Hub",
    count: 2,
    mapFocus: "Regional Hub",
    center: [21, 72],
    zoom: 4,
  },
];

// Office pins for Offices page
export const OFFICE_PINS = [
  { city: "San Francisco", region: "americas", lat: 37.7749, lng: -122.4194 },
  { city: "Sao Paulo", region: "americas", lat: -23.5505, lng: -46.6333 },
  { city: "Madrid", region: "europe", lat: 40.4168, lng: -3.7038 },
  { city: "Berlin", region: "europe", lat: 52.52, lng: 13.405 },
  { city: "Stockholm", region: "europe", lat: 59.3293, lng: 18.0686 },
  { city: "Cairo", region: "africa", lat: 30.0444, lng: 31.2357 },
  { city: "Johannesburg", region: "africa", lat: -26.2041, lng: 28.0473 },
  { city: "Dubai", region: "asia", lat: 25.2048, lng: 55.2708 },
  { city: "Bengaluru", region: "asia", lat: 12.9716, lng: 77.5946 },
  { city: "Delhi", region: "asia", lat: 28.6139, lng: 77.209 },
  { city: "Bangkok", region: "asia", lat: 13.7563, lng: 100.5018 },
  { city: "Kuala Lumpur", region: "asia", lat: 3.139, lng: 101.6869 },
  { city: "Singapore", region: "asia", lat: 1.3521, lng: 103.8198 },
  { city: "Manila", region: "asia", lat: 14.5995, lng: 120.9842 },
  { city: "Tokyo", region: "asia", lat: 35.6762, lng: 139.6503 },
  { city: "Seoul", region: "asia", lat: 37.5665, lng: 126.978 },
  { city: "Sydney", region: "oceania", lat: -33.8688, lng: 151.2093 },
  { city: "Singapore Hub", region: "hub", lat: 1.3521, lng: 103.8198 },
  { city: "Dubai Hub", region: "hub", lat: 25.2048, lng: 55.2708 },
  { city: "Jakarta", region: "asia", lat: -6.2088, lng: 106.8456 },
];

// Office countries for Offices page
export const OFFICE_COUNTRIES = [
  "United States",
  "Brazil",
  "Spain",
  "Germany",
  "Sweden",
  "Egypt",
  "South Africa",
  "United Arab Emirates",
  "India",
  "Thailand",
  "Malaysia",
  "Singapore",
  "Philippines",
  "Japan",
  "South Korea",
  "Australia",
  "Indonesia",
];

// Office statistics for Offices page
export const OFFICE_STATS = [
  { value: 56788, label: "Online Resources", separator: ",", duration: 1.2 },
  { value: 30, label: "Countries", duration: 1 },
  { value: 40, label: "Centers", duration: 1 },
];
