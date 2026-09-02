import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { insights } from "@/lib/content";

export const Route = createFileRoute("/insights/$slug")({
  component: InsightArticle,
});

function InsightArticle() {
  const { slug } = Route.useParams();
  const post = insights.find((p) => p.slug === slug);
  if (!post) throw notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link to="/insights" className="text-sm font-semibold text-primary">
        ← Insights
      </Link>
      <p className="mt-6 text-xs text-slate">{post.date}</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">{post.title}</h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-slate">
        {post.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </article>
  );
}
