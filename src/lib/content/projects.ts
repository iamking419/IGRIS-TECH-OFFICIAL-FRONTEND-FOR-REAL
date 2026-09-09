import { useMemo } from "react";
import { useContentStore } from "./store";
import type { Project, ProjectInput, ProjectStatus } from "./types";

export const PROJECT_CATEGORIES = [
  "Web Development",
  "Software Development",
  "AI Solutions",
  "Automation",
  "Digital Product",
] as const;

export const PROJECT_SERVICE_OPTIONS = [
  { slug: "web-development", label: "Web Development" },
  { slug: "software-development", label: "Software Development" },
  { slug: "ai-solutions", label: "AI Solutions" },
  { slug: "automation", label: "Automation" },
] as const;

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "in-preparation", label: "In preparation" },
  { value: "live", label: "Live" },
  { value: "archived", label: "Archived" },
];

export function emptyProjectInput(): ProjectInput {
  return {
    title: "",
    slug: "",
    client: "",
    category: "Web Development",
    description: "",
    overview: "",
    challenge: "",
    approach: "",
    design: "",
    development: "",
    results: "",
    services: [],
    technologies: [],
    url: "",
    coverImageUrl: "",
    cover_image: "",
    status: "in-preparation",
    published: false,
    featured: true,
  };
}

export function projectToInput(project: Project): ProjectInput {
  const coverImage = (project.coverImageUrl ?? project.cover_image ?? project.featuredImage ?? "").trim();

  return {
    title: project.title,
    slug: project.slug,
    client: project.client === "To be announced" ? "" : project.client,
    category: project.category,
    description: project.description,
    overview: project.overview,
    challenge: project.challenge,
    approach: project.approach,
    design: project.design,
    development: project.development,
    results: project.results ?? "",
    services: project.services,
    technologies: project.technologies,
    url: project.url ?? "",
    coverImageUrl: coverImage,
    cover_image: coverImage,
    status: project.status,
    published: project.published,
    featured: project.featured,
  };
}

/**
 * Project repository.
 * Mock implementation today. Swap the body of these functions for
 * GET/POST/PUT/DELETE /api/projects later — UI should keep calling this module.
 */
export const projectsService = {
  list(): Project[] {
    return useContentStore.getState().projects;
  },
  getById(id: string) {
    return useContentStore.getState().projects.find((p) => p.id === id) ?? null;
  },
  getBySlug(slug: string) {
    return useContentStore.getState().projects.find((p) => p.slug === slug) ?? null;
  },
  getPublishedBySlug(slug: string) {
    return (
      useContentStore
        .getState()
        .projects.find((p) => p.slug === slug && p.published) ?? null
    );
  },
  published() {
    return useContentStore.getState().projects.filter((p) => p.published);
  },
  featured() {
    return useContentStore
      .getState()
      .projects.filter((p) => p.published && p.featured);
  },
  related(slug: string) {
    return useContentStore
      .getState()
      .projects.filter((p) => p.published && p.slug !== slug);
  },
  create(input: ProjectInput) {
    return useContentStore.getState().createProject(input);
  },
  update(id: string, input: ProjectInput) {
    return useContentStore.getState().updateProject(id, input);
  },
  delete(id: string) {
    useContentStore.getState().deleteProject(id);
  },
  setPublished(id: string, published: boolean) {
    useContentStore.getState().setProjectPublished(id, published);
  },
};

export function useProjects() {
  return useContentStore((s) => s.projects);
}

export function usePublishedProjects() {
  const projects = useContentStore((s) => s.projects);
  return useMemo(() => projects.filter((p) => p.published), [projects]);
}

export function useFeaturedProjects() {
  const projects = useContentStore((s) => s.projects);
  return useMemo(
    () => projects.filter((p) => p.published && p.featured),
    [projects],
  );
}

export function useProjectBySlug(slug: string) {
  return useContentStore(
    (s) => s.projects.find((p) => p.slug === slug && p.published) ?? null,
  );
}

export function useProjectById(id: string) {
  return useContentStore((s) => s.projects.find((p) => p.id === id) ?? null);
}

export function useRelatedProjects(slug: string) {
  const projects = useContentStore((s) => s.projects);
  return useMemo(
    () => projects.filter((p) => p.published && p.slug !== slug),
    [projects, slug],
  );
}
