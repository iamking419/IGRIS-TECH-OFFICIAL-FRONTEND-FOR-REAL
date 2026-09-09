import { createFileRoute, Link } from "@tanstack/react-router";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/page/container";
import { NotFoundPage } from "@/components/page/not-found";
import { StatusChip } from "@/components/page/status-chip";
import { ProjectVisual } from "@/components/projects/project-visual";
import { JsonLd } from "@/components/seo/json-ld";
import { getService } from "@/data/services";
import {
  projectsService,
  useContentHydrated,
  useProjectBySlug,
  useRelatedProjects,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, creativeWorkJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/work/$slug")({
  head: ({ params }) => {
    const project = projectsService.getPublishedBySlug(params.slug);
    return pageHead({
      title: project?.seoTitle ?? "Work — IGRIS Tech",
      description:
        project?.seoDescription ??
        "A case study from IGRIS Tech. Published when the work is ready to share.",
      path: `/work/${params.slug}`,
    });
  },
  component: CaseStudy,
});

function Pending({ children }: { children?: string }) {
  return (
    <p className="mt-4 leading-relaxed text-quiet">
      {children || "This section will be published with the case study."}
    </p>
  );
}

function CaseStudy() {
  const { slug } = Route.useParams();
  const hydrated = useContentHydrated();
  const project = useProjectBySlug(slug);
  const related = useRelatedProjects(slug);

  if (!project) {
    if (!hydrated) {
      return (
        <main id="main">
          <Container className="pb-10 pt-28 md:pt-36">
            <p className="label-tech mb-5">Work</p>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] text-quiet md:text-6xl">
              Loading case study
            </h1>
          </Container>
        </main>
      );
    }
    return <NotFoundPage />;
  }

  const next = related[0];

  return (
    <main id="main">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/${project.slug}` },
        ])}
      />
      <JsonLd
        data={creativeWorkJsonLd({
          name: project.title,
          description: project.description,
          url: absoluteUrl(`/work/${project.slug}`),
          dateCreated: project.year ? String(project.year) : null,
        })}
      />
      <header className="border-b border-hairline">
        <Container className="pb-10 pt-28 md:pt-36">
          <p className="label-tech mb-5">Work / {project.category}</p>
          {project.placeholder && (
            <div className="mb-4">
              <StatusChip>CASE STUDY IN PREPARATION</StatusChip>
            </div>
          )}
          <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
            {project.title}
          </h1>
          <dl className="mt-10 grid gap-6 border-t border-hairline pt-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[10px] tracking-widest text-faint">CLIENT</dt>
              <dd className="mt-1 text-ink">{project.client}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest text-faint">CATEGORY</dt>
              <dd className="mt-1 text-ink">{project.category}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest text-faint">YEAR</dt>
              <dd className="mt-1 text-ink">{project.year ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest text-faint">STATUS</dt>
              <dd className="mt-1 text-ink">
                {project.placeholder ? "In preparation" : "Published"}
              </dd>
            </div>
          </dl>
        </Container>
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <ProjectVisual
            visual={project.visual}
            imageUrl={project.coverImageUrl ?? project.cover_image ?? project.featuredImage ?? null}
            className="mb-10 aspect-[16/8] min-h-56 w-full"
            caption={project.placeholder ? "PREPARING" : project.category.toUpperCase()}
          />
        </div>
      </header>

      <article>
        <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="space-y-14 md:col-span-8">
            <section>
              <h2 className="font-display text-2xl font-semibold">Overview</h2>
              <p className="mt-4 leading-relaxed text-quiet">{project.overview}</p>
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">The challenge</h2>
              {project.challenge ? (
                <p className="mt-4 leading-relaxed text-quiet">{project.challenge}</p>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">Objectives</h2>
              {project.objectives.length > 0 ? (
                <ol className="mt-6">
                  {project.objectives.map((item, i) => (
                    <li
                      key={item}
                      className="flex gap-4 border-t border-hairline py-4 text-sm last:border-b"
                    >
                      <span className="font-mono text-xs tracking-widest text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">The approach</h2>
              {project.approach ? (
                <p className="mt-4 leading-relaxed text-quiet">{project.approach}</p>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">Design</h2>
              {project.design ? (
                <p className="mt-4 leading-relaxed text-quiet">{project.design}</p>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">Development</h2>
              {project.development ? (
                <p className="mt-4 leading-relaxed text-quiet">{project.development}</p>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">Key decisions</h2>
              {project.keyDecisions.length > 0 ? (
                <ul className="mt-6 space-y-6">
                  {project.keyDecisions.map((d) => (
                    <li key={d.title} className="border-t border-hairline pt-5">
                      <h3 className="font-display text-lg font-semibold">{d.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-quiet">{d.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending />
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold">Results</h2>
              <p className="mt-4 leading-relaxed text-quiet">
                {project.results ??
                  "Results will be published when they are real. We do not invent metrics."}
              </p>
            </section>
            {project.gallery.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold">Project gallery</h2>
                <ul className="mt-6 grid gap-4">
                  {project.gallery.map((image) => (
                    <li key={image.src}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full border border-hairline"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.testimonial && (
              <section>
                <h2 className="font-display text-2xl font-semibold">Client note</h2>
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">
                  {project.testimonial}
                </blockquote>
              </section>
            )}
          </div>
          <aside className="md:col-span-4">
            <div className="border border-hairline p-6 md:sticky md:top-28">
              <p className="label-tech mb-4">Services</p>
              <ul className="space-y-2 text-sm">
                {project.services.length > 0 ? (
                  project.services.map((slug) => {
                    const s = getService(slug);
                    return s ? (
                      <li key={slug}>
                        <Link to={s.href} className="hover:underline">
                          {s.name}
                        </Link>
                      </li>
                    ) : (
                      <li key={slug}>{slug}</li>
                    );
                  })
                ) : (
                  <li className="text-quiet">To be published with the case study.</li>
                )}
              </ul>
              <p className="label-tech mb-4 mt-8">Technology</p>
              <p className="text-sm text-quiet">
                {project.technologies.length > 0
                  ? project.technologies.join(", ")
                  : "To be published with the case study."}
              </p>
              {project.url && (
                <a
                  href={project.url}
                  className="mt-8 inline-flex items-center gap-2 text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit project
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </aside>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="border-t border-hairline">
          <Container className="py-16">
            <p className="label-tech mb-8">Related work</p>
            <ul>
              {related.map((item, i) => (
                <li key={item.slug} className="border-t border-hairline last:border-b">
                  <Link
                    to="/work/$slug"
                    params={{ slug: item.slug }}
                    className="flex flex-wrap items-baseline justify-between gap-3 py-5"
                  >
                    <span className="font-display text-xl font-semibold">
                      {String(i + 1).padStart(2, "0")}  {item.title}
                    </span>
                    <span className="text-sm text-quiet">{item.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="border-t border-hairline">
        <Container className="flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Start a similar project</h2>
            <p className="mt-2 text-sm text-quiet">Tell us what you want to build.</p>
          </div>
          <ButtonLink to="/contact" variant="primary">
            Start a Project
          </ButtonLink>
        </Container>
      </section>

      {next && (
        <section className="border-t border-hairline">
          <Container className="grid gap-8 py-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <p className="label-tech mb-3">Next project</p>
              <Link
                to="/work/$slug"
                params={{ slug: next.slug }}
                className="inline-flex items-center gap-3 font-display text-3xl font-semibold"
              >
                {next.title}
                <span className="btn-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </div>
            <div className="md:col-span-7">
              <Link to="/work/$slug" params={{ slug: next.slug }}>
                <ProjectVisual
                  visual={next.visual}
                  className="aspect-[16/8]"
                  interactive={false}
                />
              </Link>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
