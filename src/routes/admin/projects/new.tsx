import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProjectForm } from "@/components/admin/project-form";
import { emptyProjectInput } from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { createProject } from "@/services/projects";

export const Route = createFileRoute("/admin/projects/new")({
  head: () =>
    pageHead({
      title: "New project — IGRIS Admin",
      description: "Create a Selected Work case study.",
      path: "/admin/projects/new",
      noIndex: true,
    }),
  component: NewProject,
});

function NewProject() {
  const navigate = useNavigate();

  return (
    <div>
      <p className="label-tech">Selected Work</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.035em]">
        New project
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-quiet">
        Content only. Imagery is handled by the public visual system — do not
        invent clients, quotes, or results.
      </p>
      <div className="mt-10">
        <ProjectForm
          initial={emptyProjectInput()}
          submitLabel="Create project"
          onCancel={() => navigate({ to: "/admin/projects" })}
          onSubmit={async (input) => {
            try {
              // Map local ProjectInput to backend ProjectCreate shape
              const payload = {
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
                results: input.results,
                cover_image: input.coverImageUrl ?? input.cover_image ?? null,
                services: input.services,
                technologies: input.technologies,
                project_link: input.url || null,
                status: input.status === "live" ? "PUBLISHED" : "DRAFT",
              };
              await createProject(payload as any);
              toast("Project created.");
              navigate({ to: "/admin/projects" });
            } catch (err) {
              toast("Failed to create project.");
              // still navigate back to list to avoid blocking; admin can retry
              navigate({ to: "/admin/projects" });
            }
          }}
        />
      </div>
    </div>
  );
}
