const sections = [
  {
    id: "what-are-cookies",
    title: "What are cookies",
    body: "Cookies are small text files placed on your device when you visit a website. They allow the site to remember your actions and preferences over time, so you don't have to re-enter information on every visit. Cookies can be session-based (deleted when you close your browser) or persistent (stored for a set period).",
  },
  {
    id: "what-we-use",
    title: "What we use",
    body: "VBYM uses essential cookies required for the platform to function — including session authentication cookies managed by Supabase, which keep you logged in securely. We may also use analytics cookies to understand how visitors navigate the platform. These are anonymised and do not identify you personally. We do not use advertising or tracking cookies.",
  },
  {
    id: "managing-cookies",
    title: "Managing cookies",
    body: "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may prevent parts of the platform from functioning correctly — for example, you may not be able to stay logged in. Preferences for non-essential cookies can be updated by contacting us.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "If you have questions about our use of cookies or wish to update your preferences, please contact us at privacy@viewbeforeyoumove.com. This cookie policy was last updated on February 9, 2026.",
  },
];

export default function CookiesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Cookie policy
          </h1>
          <p className="text-[14px] text-gray-500">Last updated: February 9, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
            {/* Sticky nav */}
            <nav className="space-y-0.5 lg:sticky lg:top-6 lg:self-start">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-1.5 text-[14px] text-gray-500 transition-colors hover:text-gray-900"
                >
                  {section.title}
                </a>
              ))}
            </nav>

            {/* Content card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="border-t border-gray-100 pt-6 first:border-0 first:pt-0"
                >
                  <h2 className="mb-2 text-[17px] font-bold text-gray-900">{section.title}</h2>
                  <p className="text-[14px] leading-relaxed text-gray-500">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
