import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-link";
import {
  CheckRow,
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import {
  PROJECT_CATEGORIES,
  PROJECT_SERVICE_OPTIONS,
  PROJECT_STATUSES,
  type ProjectInput,
  type ProjectStatus,
} from "@/lib/content";
import { slugify } from "@/lib/content/ids";

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: ProjectInput;
  submitLabel: string;
  onSubmit: (input: ProjectInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjectInput>(initial);
  const [tech, setTech] = useState(initial.technologies.join(", "));
  const [cover, setCover] = useState(initial.coverImageUrl ?? initial.cover_image ?? "");
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  useEffect(() => {
    setForm(initial);
    setTech(initial.technologies.join(", "));
    setCover(initial.coverImageUrl ?? initial.cover_image ?? "");
    setSlugTouched(Boolean(initial.slug));
  }, [initial]);

  function patch<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onTitle(value: string) {
    patch("title", value);
    if (!slugTouched) patch("slug", slugify(value));
  }

  function toggleService(slug: string) {
    patch(
      "services",
      form.services.includes(slug)
        ? form.services.filter((s) => s !== slug)
        : [...form.services, slug],
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    onSubmit({
      ...form,
      coverImageUrl: cover,
      cover_image: cover,
      technologies: tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <TextInput
            id="title"
            value={form.title}
            onChange={(e) => onTitle(e.target.value)}
            required
          />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="(URL)">
          <TextInput
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch("slug", e.target.value);
            }}
          />
        </Field>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Client" htmlFor="client" hint="(leave blank if unannounced)">
          <TextInput
            id="client"
            value={form.client}
            onChange={(e) => patch("client", e.target.value)}
          />
        </Field>
        <Field label="Category" htmlFor="category">
          <SelectInput
            id="category"
            value={form.category}
            onChange={(e) => patch("category", e.target.value)}
          >
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field label="Short description" htmlFor="description">
        <TextArea
          id="description"
          className="h-24"
          value={form.description}
          onChange={(e) => patch("description", e.target.value)}
        />
      </Field>
      <Field label="Overview" htmlFor="overview">
        <TextArea
          id="overview"
          value={form.overview}
          onChange={(e) => patch("overview", e.target.value)}
        />
      </Field>
      <Field label="Challenge" htmlFor="challenge">
        <TextArea
          id="challenge"
          value={form.challenge}
          onChange={(e) => patch("challenge", e.target.value)}
        />
      </Field>
      <Field label="Approach" htmlFor="approach">
        <TextArea
          id="approach"
          value={form.approach}
          onChange={(e) => patch("approach", e.target.value)}
        />
      </Field>
      <Field label="Design" htmlFor="design">
        <TextArea
          id="design"
          value={form.design}
          onChange={(e) => patch("design", e.target.value)}
        />
      </Field>
      <Field label="Development" htmlFor="development">
        <TextArea
          id="development"
          value={form.development}
          onChange={(e) => patch("development", e.target.value)}
        />
      </Field>
      <Field label="Results" htmlFor="results" hint="(leave blank rather than inventing metrics)">
        <TextArea
          id="results"
          value={form.results}
          onChange={(e) => patch("results", e.target.value)}
        />
      </Field>
      <fieldset className="grid gap-3">
        <legend className="text-sm">Services</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PROJECT_SERVICE_OPTIONS.map((s) => (
            <CheckRow
              key={s.slug}
              checked={form.services.includes(s.slug)}
              onChange={() => toggleService(s.slug)}
            >
              {s.label}
            </CheckRow>
          ))}
        </div>
      </fieldset>
      <Field label="Technologies" htmlFor="tech" hint="(comma separated)">
        <TextInput
          id="tech"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          placeholder="React, Node, PostgreSQL"
        />
      </Field>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Project URL" htmlFor="url" hint="(optional)">
          <TextInput
            id="url"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={form.url}
            onChange={(e) => patch("url", e.target.value)}
          />
        </Field>
        <Field label="Status" htmlFor="status">
          <SelectInput
            id="status"
            value={form.status}
            onChange={(e) => patch("status", e.target.value as ProjectStatus)}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <Field label="Cover image URL" htmlFor="cover_image" hint="(external image link)">
          <TextInput
            id="cover_image"
            type="url"
            inputMode="url"
            placeholder="https://example.com/cover.jpg"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </Field>
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-faint">PREVIEW</p>
          <CoverImagePreview url={cover} />
        </div>
      </div>
      <div className="grid gap-3 border-t border-hairline pt-6">
        <CheckRow
          checked={form.published}
          onChange={(next) => patch("published", next)}
        >
          Published on the public site
        </CheckRow>
        <CheckRow
          checked={form.featured}
          onChange={(next) => patch("featured", next)}
        >
          Feature on the homepage Selected Work
        </CheckRow>
      </div>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" arrow>
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function CoverImagePreview({ url }: { url: string }) {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!url.trim()) {
      setLoadState("idle");
      return;
    }
    setLoadState("loading");
  }, [url]);

  if (!url.trim()) {
    return (
      <div className="relative flex aspect-[16/9] w-full max-w-xs flex-col items-center justify-center border border-hairline bg-panel p-4 text-center">
        <div className="pointer-events-none absolute inset-0 hex-grid opacity-20" />
        <p className="font-mono text-[10px] tracking-widest text-faint">
          IGRIS / NO COVER IMAGE
        </p>
        <p className="mt-1 text-xs text-quiet">
          Enter an image URL to preview
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full max-w-xs overflow-hidden border border-hairline bg-canvas">
      {loadState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel">
          <span className="font-mono text-[10px] tracking-widest text-faint animate-pulse">
            LOADING PREVIEW...
          </span>
        </div>
      )}
      {loadState === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-panel p-4 text-center">
          <p className="font-mono text-[10px] tracking-widest text-faint">
            UNABLE TO LOAD IMAGE PREVIEW
          </p>
          <p className="mt-1 text-xs text-quiet">
            Verify image URL is accessible
          </p>
        </div>
      )}
      <img
        src={url}
        alt="Project cover preview"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          loadState === "loaded" ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoadState("loaded")}
        onError={() => setLoadState("error")}
      />
    </div>
  );
}
