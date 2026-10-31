import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid gap-4 py-24">
      <p className="eyebrow">Page not found</p>
      <h1 className="text-3xl font-bold">This page is not part of the plan</h1>
      <p className="text-muted">The page may have moved when the site was rebuilt.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Go to the home page</Link>
        <Link href="/projects" className="btn">See the projects</Link>
      </div>
    </div>
  );
}
