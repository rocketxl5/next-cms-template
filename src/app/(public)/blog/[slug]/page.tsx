// ⚠ SAMPLE PAGE — replace with your own implementation
// This dynamic `[slug]` page demonstrates how to structure blog post pages in your CMS + E-commerce template.

export default function BlogSlugPage() {
  return (
    <div className="prose max-w-4xl mx-auto py-12 text-center">
      <h1>Blog Post Page (Sample)</h1>
      <p>
        This is a placeholder for a dynamic blog post page. It corresponds to the URL pattern <code>/blog/[slug]</code>.
      </p>
      <p>
        You can replace this component with your own post fetching logic using Prisma, API routes, or any headless CMS.
      </p>
      <p className="text-sm text-gray-500">
        Tip: Remove this sample or adapt it when starting your project.
      </p>
    </div>
  );
}
