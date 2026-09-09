export type ProjectVisualId = "alpha" | "beta" | "gamma";

export type ProjectStatus = "live" | "in-preparation" | "archived";

export type Project = {
  id: string;
  numericId?: number | null;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number | null;
  description: string;
  overview: string;
  challenge: string;
  objectives: string[];
  approach: string;
  design: string;
  development: string;
  keyDecisions: { title: string; text: string }[];
  results: string | null;
  services: string[];
  technologies: string[];
  gallery: { src: string; alt: string }[];
  testimonial: string | null;
  coverImageUrl: string | null;
  featuredImage?: string | null;
  cover_image?: string | null;
  url: string | null;
  featured: boolean;
  published: boolean;
  placeholder: boolean;
  status: ProjectStatus;
  visual: ProjectVisualId;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
};

// Backwards-compatible alias for external API field `cover_image`.
// Some parts of the app use `featuredImage`; add `cover_image` to avoid
// breaking code that references the API-style field name.
export type ProjectWithCoverAlias = Project & { cover_image?: string | null };

export type ProjectInput = {
  title: string;
  slug: string;
  client: string;
  category: string;
  description: string;
  overview: string;
  challenge: string;
  approach: string;
  design: string;
  development: string;
  results: string;
  services: string[];
  technologies: string[];
  url: string;
  coverImageUrl?: string;
  cover_image?: string;
  status: ProjectStatus;
  published: boolean;
  featured: boolean;
};

export type ProductStatus =
  | "Live"
  | "In development"
  | "Coming soon"
  | "Experimental";

export type EcosystemProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  url: string | null;
  order: number;
  published: boolean;
  category: string;
  subdomain: string;
};

export type EcosystemInput = {
  name: string;
  description: string;
  url: string;
  status: ProductStatus;
  order: number;
  published: boolean;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  clientName: string;
  company: string;
  role: string;
  rating: number;
  content: string;
  avatar: string | null;
  project: string | null;
  website: string | null;
  status: ReviewStatus;
  published: boolean;
  createdAt: string;
};

export type ReviewInput = {
  clientName: string;
  company: string;
  role: string;
  rating: number;
  content: string;
  project: string;
  website: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  description: string;
  budget: string;
  timeline: string;
  website: string;
  contactMethod: string;
  createdAt: string;
  read: boolean;
};

export type InquiryInput = {
  name: string;
  email: string;
  company: string;
  type: string;
  description: string;
  budget: string;
  timeline: string;
  website: string;
  contactMethod: string;
};
