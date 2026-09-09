import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { seedEcosystem, seedProjects, seedReviews } from "./seed";
import { createId, hostnameFromUrl, uniqueSlug } from "./ids";
import type {
  EcosystemInput,
  EcosystemProduct,
  Inquiry,
  InquiryInput,
  Project,
  ProjectInput,
  ProjectVisualId,
  Review,
  ReviewInput,
} from "./types";
import { projectsService as apiProjects } from "@/services/projects";
import { ecosystemService as apiEcosystem } from "@/services/ecosystem";
import { reviewsService as apiReviews } from "@/services/reviews";
import { inquiriesService as apiInquiries } from "@/services/inquiries";
import { authService } from "@/services/auth";

const VISUALS: ProjectVisualId[] = ["alpha", "beta", "gamma"];

function buildProject(
  input: ProjectInput,
  existing: Project[],
  current?: Project,
): Project {
  const taken = existing
    .filter((p) => p.id !== current?.id)
    .map((p) => p.slug);
  const slug = uniqueSlug(input.slug || input.title, taken);
  const placeholder = !input.challenge && !input.approach && !input.design;
  const published = input.published;
  const resolvedCoverImageUrl =
    input.coverImageUrl?.trim() ||
    input.cover_image?.trim() ||
    current?.coverImageUrl ||
    current?.cover_image ||
    current?.featuredImage ||
    null;

  return {
    id: current?.id ?? createId("proj"),
    numericId: current?.numericId ?? null,
    slug,
    title: input.title.trim(),
    client: input.client.trim() || "To be announced",
    category: input.category.trim() || "Web Development",
    year: current?.year ?? null,
    description: input.description.trim(),
    overview: input.overview.trim(),
    challenge: input.challenge.trim(),
    objectives: current?.objectives ?? [],
    approach: input.approach.trim(),
    design: input.design.trim(),
    development: input.development.trim(),
    keyDecisions: current?.keyDecisions ?? [],
    results: input.results.trim() ? input.results.trim() : null,
    services: input.services,
    technologies: input.technologies,
    gallery: current?.gallery ?? [],
    testimonial: current?.testimonial ?? null,
    coverImageUrl: resolvedCoverImageUrl,
    featuredImage: resolvedCoverImageUrl,
    cover_image: resolvedCoverImageUrl,
    url: input.url.trim() ? input.url.trim() : null,
    featured: input.featured,
    published,
    placeholder,
    status: input.status,
    visual: current?.visual ?? VISUALS[existing.length % VISUALS.length]!,
    publishedAt: published
      ? current?.publishedAt ?? new Date().toISOString()
      : null,
    seoTitle: `${input.title.trim()} — IGRIS Tech`,
    seoDescription:
      input.description.trim() ||
      `A case study from IGRIS Tech. Published when the work is ready to share.`,
  };
}

function buildEcosystem(
  input: EcosystemInput,
  existing: EcosystemProduct[],
  current?: EcosystemProduct,
): EcosystemProduct {
  const taken = existing.filter((p) => p.id !== current?.id).map((p) => p.slug);
  const slug = uniqueSlug(input.name, taken);
  const url = input.url.trim() ? input.url.trim() : null;
  return {
    id: current?.id ?? createId("eco"),
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    status: input.status,
    url,
    order: Number.isFinite(input.order) ? input.order : existing.length + 1,
    published: input.published,
    category: current?.category || "Product",
    subdomain: url ? hostnameFromUrl(url) : current?.subdomain || `${slug}.igristech.com`,
  };
}

export type ContentState = {
  projects: Project[];
  ecosystem: EcosystemProduct[];
  reviews: Review[];
  inquiries: Inquiry[];
  loading: boolean;
  error: string | null;

  syncFromBackend: () => Promise<void>;
  createProject: (input: ProjectInput) => Promise<Project>;
  updateProject: (id: string, input: ProjectInput) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  setProjectPublished: (id: string, published: boolean) => Promise<void>;
  createEcosystem: (input: EcosystemInput) => Promise<EcosystemProduct>;
  updateEcosystem: (id: string, input: EcosystemInput) => Promise<EcosystemProduct | null>;
  deleteEcosystem: (id: string) => Promise<void>;
  createReview: (input: ReviewInput) => Promise<Review>;
  updateReview: (id: string, patch: Partial<Review>) => Promise<Review | null>;
  deleteReview: (id: string) => Promise<void>;
  createInquiry: (input: InquiryInput) => Promise<Inquiry>;
  setInquiryRead: (id: string, read: boolean) => void;
  deleteInquiry: (id: string) => Promise<void>;
};

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      ecosystem: seedEcosystem,
      reviews: seedReviews,
      inquiries: [],
      loading: false,
      error: null,

      syncFromBackend: async () => {
        set({ loading: true, error: null });
        try {
          const [projectsResult, ecoResult, revResult] = await Promise.allSettled([
            apiProjects.getPublishedProjects(),
            apiEcosystem.getEcosystemProducts(),
            apiReviews.getApprovedReviews(),
          ]);

          // Process Projects
          if (projectsResult.status === "fulfilled") {
            const rawProjects = projectsResult.value;
            const mapped: Project[] = rawProjects.map((p, idx) => ({
              id: p.slug,
              numericId: "id" in p && typeof (p as { id: unknown }).id === "number" ? (p as { id: number }).id : null,
              slug: p.slug,
              title: p.title,
              client: p.client || "To be announced",
              category: p.category || "Web Development",
              year: p.year ?? null,
              description: p.short_description || p.overview || "",
              overview: p.overview || "",
              challenge: p.challenge || "",
              objectives: [],
              approach: p.approach || "",
              design: p.design || "",
              development: p.development || "",
              keyDecisions: [],
              results: p.results || null,
              services: p.services || [],
              technologies: p.technologies || [],
              gallery: [],
              testimonial: null,
              coverImageUrl: p.cover_image || null,
              featuredImage: p.cover_image || null,
              cover_image: p.cover_image || null,
              url: p.project_link || null,
              featured: true,
              published: true,
              placeholder: !p.challenge && !p.approach && !p.design,
              status: "live",
              visual: VISUALS[idx % VISUALS.length]!,
              publishedAt: new Date().toISOString(),
              seoTitle: `${p.title} — IGRIS Tech`,
              seoDescription:
                p.short_description || p.overview || "A case study from IGRIS Tech.",
            }));
            set({ projects: mapped });
          }

          // Process Ecosystem
          if (ecoResult.status === "fulfilled") {
            const rawEco = ecoResult.value;
            const mappedEco: EcosystemProduct[] = rawEco.map((e, idx) => ({
              id: String(e.id),
              name: e.name,
              slug: e.slug,
              description: e.details,
              status: e.status === "ACTIVE" ? "Live" : "In development",
              url: e.link || null,
              order: idx + 1,
              published: e.status === "ACTIVE",
              category: "Product",
              subdomain: e.link ? hostnameFromUrl(e.link) : `${e.slug}.igristech.com`,
            }));
            set({ ecosystem: mappedEco });
          }

          // Process Reviews (Public)
          if (revResult.status === "fulfilled") {
            const rawRevs = revResult.value;
            const mappedRevs: Review[] = rawRevs.map((r) => ({
              id: String(r.id),
              clientName: r.name,
              company: r.company || "",
              role: r.role || "",
              rating: r.rating,
              content: r.content,
              avatar: null,
              project: null,
              website: null,
              status: "approved",
              published: true,
              createdAt: r.created_at || new Date().toISOString(),
            }));
            set({ reviews: mappedRevs });
          }

          // If Admin is authenticated, also sync admin reviews and inquiries
          if (authService.hasToken()) {
            try {
              const [adminRevs, adminInqs] = await Promise.all([
                apiReviews.getAdminReviews(),
                apiInquiries.getContactInquiries(),
              ]);

              if (Array.isArray(adminRevs)) {
                const mappedAdminRevs: Review[] = adminRevs.map((r) => ({
                  id: String(r.id),
                  clientName: r.name,
                  company: r.company || "",
                  role: r.role || "",
                  rating: r.rating,
                  content: r.content,
                  avatar: null,
                  project: null,
                  website: null,
                  status: (r.status.toLowerCase() as "pending" | "approved" | "rejected") || "pending",
                  published: r.status === "APPROVED",
                  createdAt: r.created_at || new Date().toISOString(),
                }));
                set({ reviews: mappedAdminRevs });
              }

              if (Array.isArray(adminInqs)) {
                const mappedInqs: Inquiry[] = adminInqs.map((c) => ({
                  id: String(c.id),
                  name: c.name,
                  email: c.email,
                  company: c.company || "",
                  type: c.project_type || "General Inquiry",
                  description: c.description,
                  budget: c.budget || "Prefer not to say",
                  timeline: c.timeline || "Flexible",
                  website: "",
                  contactMethod: "Email",
                  createdAt: c.created_at || new Date().toISOString(),
                  read: c.status !== "NEW",
                }));
                set({ inquiries: mappedInqs });
              }
            } catch (adminErr) {
              console.warn("[store] Admin data fetch warning:", adminErr);
            }
          }

          set({ loading: false });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : "Sync error",
          });
        }
      },

      createProject: async (input) => {
        try {
          const res = await apiProjects.createProject({
            title: input.title,
            slug: input.slug,
            client: input.client,
            category: input.category,
            short_description: input.description,
            overview: input.overview,
            challenge: input.challenge,
            approach: input.approach,
            design: input.design,
            development: input.development,
            results: input.results || null,
            cover_image: input.coverImageUrl ?? input.cover_image ?? null,
            services: input.services,
            technologies: input.technologies,
            project_link: input.url || null,
            status: input.published ? "PUBLISHED" : "DRAFT",
          });

          const local = buildProject(input, get().projects);
          local.id = res.slug;
          local.numericId = res.id;
          local.coverImageUrl = res.cover_image ?? local.coverImageUrl ?? null;
          local.cover_image = res.cover_image ?? null;
          local.featuredImage = res.cover_image ?? null;
          set({ projects: [...get().projects, local] });
          return local;
        } catch {
          const fallback = buildProject(input, get().projects);
          set({ projects: [...get().projects, fallback] });
          return fallback;
        }
      },

      updateProject: async (id, input) => {
        const current = get().projects.find((p) => p.id === id || p.slug === id);
        if (!current) return null;

        const next = buildProject(input, get().projects, current);

        if (current.numericId) {
          try {
            await apiProjects.updateProject(current.numericId, {
              title: input.title,
              slug: input.slug,
              client: input.client,
              category: input.category,
              short_description: input.description,
              overview: input.overview,
              challenge: input.challenge,
              approach: input.approach,
              design: input.design,
              development: input.development,
              results: input.results || null,
              cover_image: input.coverImageUrl ?? input.cover_image ?? null,
              services: input.services,
              technologies: input.technologies,
              project_link: input.url || null,
              status: input.published ? "PUBLISHED" : "DRAFT",
            });
          } catch (err) {
            console.warn("[store] Backend update failed, updating local state:", err);
          }
        }

        set({
          projects: get().projects.map((p) => (p.id === id || p.slug === id ? next : p)),
        });
        return next;
      },

      deleteProject: async (id) => {
        const current = get().projects.find((p) => p.id === id || p.slug === id);
        if (current?.numericId) {
          try {
            await apiProjects.deleteProject(current.numericId);
          } catch (err) {
            console.warn("[store] Backend delete project failed:", err);
          }
        }
        set({
          projects: get().projects.filter((p) => p.id !== id && p.slug !== id),
        });
      },

      setProjectPublished: async (id, published) => {
        const current = get().projects.find((p) => p.id === id || p.slug === id);
        if (current?.numericId) {
          try {
            await apiProjects.updateProject(current.numericId, {
              status: published ? "PUBLISHED" : "DRAFT",
            });
          } catch (err) {
            console.warn("[store] Backend status update failed:", err);
          }
        }
        set({
          projects: get().projects.map((p) =>
            p.id === id || p.slug === id
              ? {
                  ...p,
                  published,
                  publishedAt: published
                    ? p.publishedAt ?? new Date().toISOString()
                    : null,
                }
              : p,
          ),
        });
      },

      createEcosystem: async (input) => {
        try {
          const res = await apiEcosystem.createEcosystemProduct({
            name: input.name,
            slug: uniqueSlug(input.name, get().ecosystem.map((e) => e.slug)),
            details: input.description,
            link: input.url || null,
            status: input.published ? "ACTIVE" : "INACTIVE",
          });

          const local = buildEcosystem(input, get().ecosystem);
          local.id = String(res.id);
          set({ ecosystem: [...get().ecosystem, local] });
          return local;
        } catch {
          const fallback = buildEcosystem(input, get().ecosystem);
          set({ ecosystem: [...get().ecosystem, fallback] });
          return fallback;
        }
      },

      updateEcosystem: async (id, input) => {
        const current = get().ecosystem.find((p) => p.id === id);
        if (!current) return null;
        const next = buildEcosystem(input, get().ecosystem, current);

        const numericId = Number(id);
        if (!isNaN(numericId)) {
          try {
            await apiEcosystem.updateEcosystemProduct(numericId, {
              name: input.name,
              details: input.description,
              link: input.url || null,
              status: input.published ? "ACTIVE" : "INACTIVE",
            });
          } catch (err) {
            console.warn("[store] Backend ecosystem update failed:", err);
          }
        }

        set({
          ecosystem: get().ecosystem.map((p) => (p.id === id ? next : p)),
        });
        return next;
      },

      deleteEcosystem: async (id) => {
        const numericId = Number(id);
        if (!isNaN(numericId)) {
          try {
            await apiEcosystem.deleteEcosystemProduct(numericId);
          } catch (err) {
            console.warn("[store] Backend ecosystem delete failed:", err);
          }
        }
        set({ ecosystem: get().ecosystem.filter((p) => p.id !== id) });
      },

      createReview: async (input) => {
        try {
          const res = await apiReviews.submitReview({
            name: input.clientName.trim(),
            company: input.company.trim() || undefined,
            role: input.role.trim() || undefined,
            content: input.content.trim(),
            rating: input.rating,
          });

          const review: Review = {
            id: String(res.id),
            clientName: res.name,
            company: res.company || "",
            role: res.role || "",
            rating: res.rating,
            content: res.content,
            avatar: null,
            project: input.project.trim() || null,
            website: input.website.trim() || null,
            status: "pending",
            published: false,
            createdAt: res.created_at || new Date().toISOString(),
          };
          set({ reviews: [review, ...get().reviews] });
          return review;
        } catch {
          const fallback: Review = {
            id: createId("rev"),
            clientName: input.clientName.trim(),
            company: input.company.trim(),
            role: input.role.trim(),
            rating: input.rating,
            content: input.content.trim(),
            avatar: null,
            project: input.project.trim() || null,
            website: input.website.trim() || null,
            status: "pending",
            published: false,
            createdAt: new Date().toISOString(),
          };
          set({ reviews: [fallback, ...get().reviews] });
          return fallback;
        }
      },

      updateReview: async (id, patch) => {
        const current = get().reviews.find((r) => r.id === id);
        if (!current) return null;
        const next = { ...current, ...patch, id: current.id };

        const numericId = Number(id);
        if (!isNaN(numericId)) {
          try {
            await apiReviews.updateReview(numericId, {
              status: patch.status === "approved"
                ? "APPROVED"
                : patch.status === "rejected"
                  ? "REJECTED"
                  : patch.status === "pending"
                    ? "PENDING"
                    : undefined,
              content: patch.content,
              rating: patch.rating,
            });
          } catch (err) {
            console.warn("[store] Backend review update failed:", err);
          }
        }

        set({
          reviews: get().reviews.map((r) => (r.id === id ? next : r)),
        });
        return next;
      },

      deleteReview: async (id) => {
        const numericId = Number(id);
        if (!isNaN(numericId)) {
          try {
            await apiReviews.deleteReview(numericId);
          } catch (err) {
            console.warn("[store] Backend review delete failed:", err);
          }
        }
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
      },

      createInquiry: async (input) => {
        try {
          const res = await apiInquiries.submitContactInquiry({
            name: input.name.trim(),
            email: input.email.trim(),
            company: input.company.trim() || undefined,
            project_type: input.type.trim() || undefined,
            timeline: input.timeline.trim() || undefined,
            budget: input.budget.trim() || undefined,
            description: input.description.trim(),
          });

          const inquiry: Inquiry = {
            id: String(res.id),
            name: res.name,
            email: res.email,
            company: res.company || "",
            type: res.project_type || "General Inquiry",
            description: res.description,
            budget: res.budget || "Prefer not to say",
            timeline: res.timeline || "Flexible",
            website: input.website.trim(),
            contactMethod: input.contactMethod.trim(),
            createdAt: res.created_at || new Date().toISOString(),
            read: false,
          };
          set({ inquiries: [inquiry, ...get().inquiries] });
          return inquiry;
        } catch {
          const fallback: Inquiry = {
            id: createId("inq"),
            name: input.name.trim(),
            email: input.email.trim(),
            company: input.company.trim(),
            type: input.type.trim(),
            description: input.description.trim(),
            budget: input.budget.trim(),
            timeline: input.timeline.trim(),
            website: input.website.trim(),
            contactMethod: input.contactMethod.trim(),
            createdAt: new Date().toISOString(),
            read: false,
          };
          set({ inquiries: [fallback, ...get().inquiries] });
          return fallback;
        }
      },

      setInquiryRead: (id, read) => {
        set({
          inquiries: get().inquiries.map((i) =>
            i.id === id ? { ...i, read } : i,
          ),
        });
      },

      deleteInquiry: async (id) => {
        const numericId = Number(id);
        if (!isNaN(numericId)) {
          try {
            await apiInquiries.deleteContactInquiry(numericId);
          } catch (err) {
            console.warn("[store] Backend inquiry delete failed:", err);
          }
        }
        set({ inquiries: get().inquiries.filter((i) => i.id !== id) });
      },
    }),
    {
      name: "igris-content-v1",
      skipHydration: true,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    },
  ),
);
