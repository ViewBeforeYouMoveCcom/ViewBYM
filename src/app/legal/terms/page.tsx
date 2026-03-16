const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "These Terms and Conditions govern your use of the View Before You Move (VBYM) platform, including all associated pages, services, and tools. By accessing or using VBYM, you agree to be bound by these terms. If you do not agree, please do not use the platform.",
  },
  {
    id: "accounts",
    title: "Accounts",
    body: "You must be at least 18 years old to create an account. You are responsible for maintaining the security of your account credentials. VBYM will not be liable for any loss or damage arising from unauthorised access to your account. You must notify us immediately if you suspect any breach of security.",
  },
  {
    id: "listings",
    title: "Listings",
    body: "All property listings published through VBYM are submitted by registered estate agents. VBYM acts solely as a technology platform and is not an estate agency. We do not verify the accuracy of listing content and accept no liability for errors, omissions, or misrepresentations made by agents. Any enquiries or transactions are between the buyer and the agent directly.",
  },
  {
    id: "payments",
    title: "Payments",
    body: "VBYM does not currently charge buyers or tenants for use of the platform. Agency access fees, where applicable, are subject to a separate agreement between VBYM and the agency. All fees are non-refundable unless otherwise stated in writing.",
  },
  {
    id: "liability",
    title: "Liability",
    body: "To the fullest extent permitted by law, VBYM excludes all warranties, representations, and conditions relating to the platform. VBYM shall not be liable for any indirect, incidental, or consequential loss arising from your use of the platform or reliance on any content therein. Our total liability in connection with any claim shall not exceed £100.",
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: "We reserve the right to update these Terms and Conditions at any time. Material changes will be communicated via the platform or by email where appropriate. Continued use of VBYM after changes are published constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1200px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Terms and conditions
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
