import type { EcosystemProduct, Project, Review } from "./types";

/**
 * Single mock dataset. Public UI and admin both read through the content store.
 * Replace this module with API responses later — do not duplicate these arrays in components.
 */
export const seedProjects: Project[] = [
  {
    id: "proj_web_platform",
    slug: "web-platform",
    title: "Web platform",
    client: "To be announced",
    category: "Web Development",
    year: null,
    description:
      "A web platform case study will be published here when the work is ready to share.",
    overview:
      "This entry is a structured placeholder. The case study format is in place so real work can be published without rebuilding the site.",
    challenge: "",
    objectives: [],
    approach: "",
    design: "",
    development: "",
    keyDecisions: [],
    results: null,
    services: ["web-development"],
    technologies: [],
    gallery: [],
    testimonial: null,
    coverImageUrl: null,
    featuredImage: null,
    cover_image: null,
    url: null,
    featured: true,
    published: true,
    placeholder: true,
    status: "in-preparation",
    visual: "alpha",
    publishedAt: null,
    seoTitle: "Web platform — IGRIS Tech",
    seoDescription:
      "A web development case study from IGRIS Tech. Published when the work is ready to share.",
  },
  {
    id: "proj_custom_system",
    slug: "custom-system",
    title: "Custom system",
    client: "To be announced",
    category: "Software Development",
    year: null,
    description:
      "A custom software case study will be published here when the work is ready to share.",
    overview:
      "This entry is a structured placeholder. Challenge, approach, design, and development will be written from the actual project — not invented.",
    challenge: "",
    objectives: [],
    approach: "",
    design: "",
    development: "",
    keyDecisions: [],
    results: null,
    services: ["software-development"],
    technologies: [],
    gallery: [],
    testimonial: null,
    coverImageUrl: null,
    featuredImage: null,
    cover_image: null,
    url: null,
    featured: true,
    published: true,
    placeholder: true,
    status: "in-preparation",
    visual: "beta",
    publishedAt: null,
    seoTitle: "Custom system — IGRIS Tech",
    seoDescription:
      "A software development case study from IGRIS Tech. Published when the work is ready to share.",
  },
  {
    id: "proj_intelligent_product",
    slug: "intelligent-product",
    title: "Intelligent product",
    client: "To be announced",
    category: "AI Solutions",
    year: null,
    description:
      "An intelligent product case study will be published here when the work is ready to share.",
    overview:
      "This entry is a structured placeholder. No metrics, quotes, or client names are fabricated to fill the page.",
    challenge: "",
    objectives: [],
    approach: "",
    design: "",
    development: "",
    keyDecisions: [],
    results: null,
    services: ["ai-solutions", "automation"],
    technologies: [],
    gallery: [],
    testimonial: null,
    coverImageUrl: null,
    featuredImage: null,
    cover_image: null,
    url: null,
    featured: true,
    published: true,
    placeholder: true,
    status: "in-preparation",
    visual: "gamma",
    publishedAt: null,
    seoTitle: "Intelligent product — IGRIS Tech",
    seoDescription:
      "An AI and automation case study from IGRIS Tech. Published when the work is ready to share.",
  },
];

export const seedEcosystem: EcosystemProduct[] = [
  {
    id: "eco_hosting",
    name: "IGRIS Hosting",
    slug: "hosting",
    description:
      "Infrastructure for the modern web. Product details will be published as the work lands.",
    status: "In development",
    url: null,
    order: 1,
    published: true,
    category: "Infrastructure",
    subdomain: "hosting.igristech.com",
  },
  {
    id: "eco_studio",
    name: "IGRIS Studio",
    slug: "studio",
    description:
      "A product in the IGRIS ecosystem. Scope and features will be published when they are real.",
    status: "In development",
    url: null,
    order: 2,
    published: true,
    category: "Platform",
    subdomain: "studio.igristech.com",
  },
];

export const seedReviews: Review[] = [];

export const FUTURE_PRODUCTS_NOTE =
  "Further products will sit on their own subdomains under igristech.com when they are ready.";
