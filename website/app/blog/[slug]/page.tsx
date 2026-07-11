import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import WaitlistCTA from "@/components/WaitlistCTA";
import { posts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Story not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.img],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <PageShell>
      <article className="bg-midnight pb-24 pt-40 sm:pt-48">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <p className="label-kicker mb-5">
              {post.tag} · {post.displayDate} · {post.readTime}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-ivory/60">
              {post.excerpt}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="mt-12 h-72 w-full rounded-[28px] border border-ivory/5 bg-cover bg-center sm:h-96"
              style={{
                backgroundImage: `url('${post.img}'), linear-gradient(135deg, #24356B 0%, #151A24 70%)`,
              }}
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 space-y-7 text-lg leading-relaxed text-ivory/75">
              {post.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 border-t border-ivory/10 pt-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-label text-ivory/40">
                Keep reading
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group rounded-3xl border border-ivory/5 bg-charcoal/40 p-6 transition hover:border-ivory/15"
                  >
                    <p className="mb-2 text-xs font-semibold uppercase tracking-label text-golden">
                      {p.tag}
                    </p>
                    <p className="font-display text-xl font-bold leading-snug text-ivory">
                      {p.title}
                    </p>
                    <p className="mt-2 text-sm text-ivory/55">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
              <p className="mt-8 text-center">
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-golden underline-offset-4 hover:underline"
                >
                  ← All stories
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </article>

      <WaitlistCTA />
    </PageShell>
  );
}
