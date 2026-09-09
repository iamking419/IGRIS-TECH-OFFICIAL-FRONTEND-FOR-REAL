import { useEffect, useState } from "react";
import type { Project } from "@/lib/content/types";
import type { ProjectPublicResponse } from "@/types/project";
import { listPublicProjects } from "@/services/projects";
import { useFeaturedProjects as useLocalFeatured } from "@/lib/content/projects";

export function useRemoteFeaturedProjects() {
  const local = useLocalFeatured();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    void listPublicProjects()
      .then((res: ProjectPublicResponse[] | undefined) => {
        if (!mounted) return;
        if (res && res.length > 0) {
          // Map backend shape to local `Project` shape used across the app.
          const mapped: Project[] = res.map((p) => ({
            id: p.slug,
            numericId: undefined,
            slug: p.slug,
            title: p.title,
            client: p.client ?? "",
            category: p.category,
            year: p.year ?? null,
            description: p.short_description ?? p.overview ?? "",
            overview: p.overview ?? "",
            challenge: p.challenge ?? "",
            objectives: [],
            approach: p.approach ?? "",
            design: p.design ?? "",
            development: p.development ?? "",
            keyDecisions: [],
            results: p.results ?? null,
            services: p.services ?? [],
            technologies: p.technologies ?? [],
            gallery: [],
            testimonial: null,
            coverImageUrl: p.cover_image ?? null,
            featuredImage: p.cover_image ?? null,
            cover_image: p.cover_image ?? null,
            url: p.project_link ?? null,
            featured: false,
            published: true,
            placeholder: false,
            status: "live",
            visual: "alpha",
            publishedAt: null,
            seoTitle: p.title ?? "",
            seoDescription: p.short_description ?? "",
          }));

          setItems(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message ?? String(err));
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return {
    items: items.length > 0 ? items : local,
    loading,
    error,
  };
}
