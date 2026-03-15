const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "View Before You Move (VBYM) is committed to protecting your privacy. This policy explains what personal data we collect, how we use it, and your rights in relation to it. We collect only the minimum data required to provide account features, respond to support requests, and improve the platform.",
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: "We may collect the following categories of personal data: your name and email address when you create an account; contact details submitted through enquiry or agent application forms; usage data such as pages visited and searches performed; and technical data such as IP address, browser type, and device information collected automatically when you use the platform.",
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: "We use your data to create and manage your account, respond to enquiries and support requests, and send relevant service communications. We may use aggregated, anonymised usage data to improve the platform. We do not sell your personal data to third parties and do not use it for unsolicited direct marketing without your consent.",
  },
  {
    id: "third-parties",
    title: "Third parties",
    body: "We use Supabase to store account and application data. We may also use third-party services for analytics and platform infrastructure. These providers are bound by data processing agreements and may only process your data on our instruction. We do not share identifiable personal data with estate agents or other third parties without your explicit consent.",
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: "Under UK GDPR, you have the right to access, correct, or delete your personal data; to object to or restrict processing; and to data portability. To exercise any of these rights, please contact us at the address below. We aim to respond to all requests within 30 days.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "If you have questions about this privacy policy or how we handle your data, please contact us at privacy@vbym.co.uk. If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-600">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Privacy policy
          </h1>
          <p className="text-[14px] text-gray-500">Last updated: February 9, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-5">
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
