import { Link } from "@tanstack/react-router";
import { ProjectVisual } from "@/components/projects/project-visual";
import { StatusChip } from "@/components/page/status-chip";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProjectRow({
  project,
  index,
  reverse = false,
}: {
  project: Project;
  index: number;
  reverse?: boolean;
}) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: project.slug }}
      className="group grid border-t border-hairline py-10 last:border-b md:grid-cols-12 md:items-center md:gap-10 md:py-12"
    >
      <div
        className={cn(
          "md:col-span-7",
          reverse && "md:order-2",
        )}
      >
        <ProjectVisual
          visual={project.visual}
          imageUrl={project.coverImageUrl ?? project.cover_image ?? project.featuredImage ?? null}
          className="aspect-[16/10]"
          caption={project.placeholder ? "PREPARING" : project.category.toUpperCase()}
        />
      </div>
      <div
        className={cn(
          "mt-6 md:col-span-5 md:mt-0",
          reverse && "md:order-1",
        )}
      >
        <p className="font-mono text-xs tracking-widest text-faint">
          {String(index + 1).padStart(2, "0")} / {project.category.toUpperCase()}
        </p>
        {project.placeholder && (
          <div className="mt-3">
            <StatusChip>CASE STUDY IN PREPARATION</StatusChip>
          </div>
        )}
        <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-quiet">
          {project.description}
        </p>
        {project.services.length > 0 && (
          <p className="mt-4 font-mono text-[10px] tracking-widest text-faint">
            {project.services.join(" · ").replaceAll("-", " ").toUpperCase()}
          </p>
        )}
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-ink">
          View case study
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
