const navSections = [
  { id: "about", title: "1. About these Terms" },
  { id: "platform", title: "2. What the Platform does" },
  { id: "eligibility", title: "3. Eligibility and accounts" },
  { id: "searches", title: "4. Searches, favourites and alerts" },
  { id: "enquiries", title: "5. Property enquiries" },
  { id: "due-diligence", title: "6. Property information and due diligence" },
  { id: "vr-content", title: "7. Video, 360-degree and immersive VR content" },
  { id: "acceptable-use", title: "8. Acceptable use" },
  { id: "ip", title: "9. Intellectual property" },
  { id: "third-party", title: "10. Third-party services and technical suppliers" },
  { id: "availability", title: "11. Platform availability and security" },
  { id: "suspension", title: "12. Suspension and account closure" },
  { id: "privacy", title: "13. Privacy, international access and cookies" },
  { id: "changes", title: "14. Changes" },
  { id: "liability", title: "15. Liability" },
  { id: "contact", title: "16. Complaints, law and contact" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[17px] font-bold text-gray-900">{children}</h2>
  );
}

function SubSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
      <span className="font-semibold text-gray-800">{id}</span>&ensp;{children}
    </p>
  );
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-3 ml-4 space-y-1.5 list-disc marker:text-gray-400">
      {items.map((item, i) => (
        <li key={i} className="text-[14px] leading-relaxed text-gray-600">{item}</li>
      ))}
    </ul>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 pt-6 mt-6" />;
}

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Consumer Website Terms of Use
          </h1>
          <p className="mb-1 text-[14px] text-gray-500">
            For property seekers, buyers, tenants and general visitors
          </p>
          <p className="text-[14px] text-gray-500">Version 1.0 | Effective date: 10 August 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[220px_1fr]">

            {/* Sticky nav */}
            <nav className="space-y-0.5 lg:sticky lg:top-6 lg:self-start">
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block py-1.5 text-[13px] text-gray-500 transition-colors hover:text-gray-900"
                >
                  {s.title}
                </a>
              ))}
            </nav>

            {/* Content card */}
            <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:p-8 space-y-0">

              <p className="mb-6 text-[13.5px] leading-relaxed text-gray-500">
                These Terms are intentionally separate from the Agency Terms of Business. Estate agents and other professional users must accept the Agency Terms and any applicable Order Form.
              </p>

              {/* 1 */}
              <div id="about">
                <SectionTitle>1. About these Terms</SectionTitle>
                <SubSection id="1.1">
                  These Consumer Website Terms of Use (&ldquo;Terms&rdquo;) govern access to and use of the consumer-facing website, property-search services, user-account features and related digital services operated by View Before You Move Ltd (&ldquo;VBYM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;).
                </SubSection>
                <SubSection id="1.2">
                  We are registered in England and Wales under company number 16896041. Our registered office is 10A King Street, Luton, England, LU1 2DP.
                </SubSection>
                <SubSection id="1.3">
                  These Terms apply where you use the Platform wholly or mainly for personal purposes as a property seeker, prospective buyer, tenant, landlord, seller or general visitor (&ldquo;you&rdquo;). They do not govern paid business services supplied to estate agents or other professional customers.
                </SubSection>
                <SubSection id="1.4">
                  If you create an account or submit an enquiry, you must actively accept the version of these Terms presented to you. If you only browse public pages, your continued use after a clear notice means that these Terms apply to that use to the extent permitted by law.
                </SubSection>
                <SubSection id="1.5">
                  You may stop using the Platform at any time and may request closure of a registered account under section 12.
                </SubSection>
                <SubSection id="1.6">
                  Nothing in these Terms excludes, restricts or replaces any statutory rights or remedies you have as a consumer.
                </SubSection>
              </div>

              <Divider />

              {/* 2 */}
              <div id="platform">
                <SectionTitle>2. What the Platform does</SectionTitle>
                <SubSection id="2.1">
                  The Platform helps users search for and explore property listings. A listing may include property details, photographs, a floor plan, a standard video walkthrough, a moving 360-degree tour, an immersive VR viewing mode, maps, street-view content and contact details for the relevant estate or letting agent.
                </SubSection>
                <SubSection id="2.2">
                  Not every listing includes every feature. Availability and quality may vary by property, agency, device, browser, connection and third-party service.
                </SubSection>
                <SubSection id="2.3">
                  The Platform may allow you to save properties or searches, receive alerts and submit enquiries to an estate agent.
                </SubSection>
                <SubSection id="2.4">
                  We are not an estate agent and do not act for a seller, landlord, buyer, tenant or estate agent in a property transaction. We do not conduct valuations, negotiate offers, provide surveys or provide legal, tax, mortgage, financial or investment advice.
                </SubSection>
                <SubSection id="2.5">
                  We do not guarantee that any property is available, suitable, accurately described, mortgageable, legally compliant or capable of being bought or rented on the terms shown.
                </SubSection>
              </div>

              <Divider />

              {/* 3 */}
              <div id="eligibility">
                <SectionTitle>3. Eligibility and accounts</SectionTitle>
                <SubSection id="3.1">
                  You must be at least 18 years old to create an account, save searches, receive personalised alerts or submit an enquiry.
                </SubSection>
                <SubSection id="3.2">
                  You must provide accurate and current information and must not impersonate another person or create an account using an email address you are not entitled to use.
                </SubSection>
                <SubSection id="3.3">
                  You are responsible for keeping your password and login information secure and must tell us promptly if you believe your account has been accessed without permission.
                </SubSection>
                <SubSection id="3.4">
                  We may require email verification, password reset or reasonable security checks before allowing access to certain features.
                </SubSection>
              </div>

              <Divider />

              {/* 4 */}
              <div id="searches">
                <SectionTitle>4. Searches, favourites and alerts</SectionTitle>
                <SubSection id="4.1">
                  Search results are generated from information available to the Platform at the time of the search and may be affected by incomplete data, third-party services and technical limitations.
                </SubSection>
                <SubSection id="4.2">
                  Saved properties, saved searches and alerts are convenience features only. We do not guarantee that an alert will be sent, received or delivered before a property changes or is removed.
                </SubSection>
                <SubSection id="4.3">
                  You should confirm current details directly with the listing agent.
                </SubSection>
              </div>

              <Divider />

              {/* 5 */}
              <div id="enquiries">
                <SectionTitle>5. Property enquiries</SectionTitle>
                <SubSection id="5.1">
                  When you submit an enquiry, you ask us to send the information you provide to the estate agent or professional responsible for the listing so that they can respond.
                </SubSection>
                <SubSection id="5.2">
                  The relevant agent is responsible for how it handles and responds to your enquiry after receiving it.
                </SubSection>
                <SubSection id="5.3">
                  You must not use enquiry forms for spam, abuse, unrelated marketing, unlawful content or information about another person without authority.
                </SubSection>
                <SubSection id="5.4">
                  Do not include bank details, identity documents, health information, alarm codes or other sensitive information in a general enquiry unless specifically requested through an appropriate secure process.
                </SubSection>
              </div>

              <Divider />

              {/* 6 */}
              <div id="due-diligence">
                <SectionTitle>6. Property information and due diligence</SectionTitle>
                <SubSection id="6.1">
                  Property information is provided by estate agents, owners, landlords, developers, public sources and other third parties. We may format, process or display that information, but we do not independently verify every statement.
                </SubSection>
                <SubSection id="6.2">
                  Descriptions, prices, tenure details, service charges, measurements, areas, floor plans, boundaries, photographs, videos and tours are indicative and may contain errors or become out of date.
                </SubSection>
                <SubSection id="6.3">
                  A property tour or photograph records the property at a particular time. The property, contents, condition, decor, fixtures, view, surroundings and availability may later change.
                </SubSection>
                <SubSection id="6.4">
                  Before making any financial or legal commitment, you must carry out your own checks and obtain appropriate professional advice, inspections, searches, surveys and legal advice.
                </SubSection>
                <SubSection id="6.5">
                  Nothing on the Platform constitutes an offer, valuation, survey, warranty or representation by VBYM.
                </SubSection>
              </div>

              <Divider />

              {/* 7 */}
              <div id="vr-content">
                <SectionTitle>7. Video, 360-degree and immersive VR content</SectionTitle>
                <SubSection id="7.1">
                  A moving 360-degree tour may allow you to look around while the tour progresses. It is not the same as an in-person viewing and may not permit free movement to any point in the property.
                </SubSection>
                <SubSection id="7.2">
                  The immersive experience depends on device, browser, internet connection, screen, headset compatibility and settings.
                </SubSection>
                <SubSection id="7.3">
                  Video and immersive content can omit details, distort scale and be affected by lighting or processing. It cannot reveal every defect, sound, smell, access issue or neighbourhood condition.
                </SubSection>
                <SubSection id="7.4">
                  You must not treat a tour, floor plan or immersive experience as a substitute for an in-person viewing, survey or independent legal and technical checks.
                </SubSection>
              </div>

              <Divider />

              {/* 8 */}
              <div id="acceptable-use">
                <SectionTitle>8. Acceptable use</SectionTitle>
                <SubSection id="8.1">
                  You may use the Platform only for lawful personal purposes and in accordance with these Terms.
                </SubSection>
                <SubSection id="8.2">
                  You must not scrape, harvest, copy, download or systematically extract listings, images, tours, contact details or other data, except through normal personal use of the Platform.
                </SubSection>
                <SubSection id="8.3">
                  You must not use bots, crawlers, automated scripts or similar tools without our prior written permission.
                </SubSection>
                <SubSection id="8.4">
                  You must not attempt to bypass security, access another person&rsquo;s account or obtain unpublished media, source files, credentials or restricted information.
                </SubSection>
                <SubSection id="8.5">
                  You must not introduce malicious code, interfere with or overload the Platform, or test its security without our prior written permission.
                </SubSection>
                <SubSection id="8.6">
                  You must not copy, frame, embed, republish, sell or commercially exploit Platform content except as expressly permitted by these Terms or by us in writing.
                </SubSection>
                <SubSection id="8.7">
                  You must not submit or transmit content that is false, misleading, abusive, discriminatory, defamatory, unlawful or infringes another person&rsquo;s rights.
                </SubSection>
                <SubSection id="8.8">
                  You must not use Platform information in a way that breaches privacy, data-protection, confidentiality or intellectual-property law.
                </SubSection>
              </div>

              <Divider />

              {/* 9 */}
              <div id="ip">
                <SectionTitle>9. Intellectual property</SectionTitle>
                <SubSection id="9.1">
                  The Platform, software, design, branding, database structure, text, graphics and VBYM-created media are owned by or licensed to us and are protected by intellectual-property laws.
                </SubSection>
                <SubSection id="9.2">
                  Third-party logos, descriptions and other materials remain owned by their respective owners.
                </SubSection>
                <SubSection id="9.3">
                  We grant you a limited, personal, non-exclusive, non-transferable and revocable right to access and view the Platform for lawful personal use.
                </SubSection>
                <SubSection id="9.4">
                  You may share a normal hyperlink to a public listing. You must not frame the Platform or embed immersive content without written permission.
                </SubSection>
              </div>

              <Divider />

              {/* 10 */}
              <div id="third-party">
                <SectionTitle>10. Third-party services and technical suppliers</SectionTitle>
                <SubSection id="10.1">
                  The Platform may use third-party services including maps, payment services, analytics, video players, estate-agent systems, hosting, database, communications and security providers.
                </SubSection>
                <SubSection id="10.2">
                  We may use approved hosting, database, authentication, payment, communications, security, software-development and technical-support providers to operate and support the Platform. VBYM retains ownership and control of the principal Platform accounts and determines who may access live systems. Any approved supplier access is limited by role, individual account, multi-factor authentication, contract and applicable data-protection and international-transfer safeguards.
                </SubSection>
                <SubSection id="10.3">
                  Third-party services may be subject to separate terms and privacy notices. We do not guarantee that a third-party service will remain available, accurate or secure.
                </SubSection>
              </div>

              <Divider />

              {/* 11 */}
              <div id="availability">
                <SectionTitle>11. Platform availability and security</SectionTitle>
                <SubSection id="11.1">
                  We use reasonable care and skill in operating the Platform but do not guarantee uninterrupted, error-free or continuously secure availability.
                </SubSection>
                <SubSection id="11.2">
                  We may restrict access for maintenance, security, capacity, legal or operational reasons.
                </SubSection>
                <SubSection id="11.3">
                  You are responsible for using an up-to-date device, browser, operating system and security software.
                </SubSection>
                <SubSection id="11.4">
                  Security issues should be reported privately and must not be publicly disclosed or exploited.
                </SubSection>
              </div>

              <Divider />

              {/* 12 */}
              <div id="suspension">
                <SectionTitle>12. Suspension and account closure</SectionTitle>
                <SubSection id="12.1">
                  We may suspend, restrict or close an account where reasonably necessary because of breach, fraud, abuse, security risk, legal requirement or risk to another person.
                </SubSection>
                <SubSection id="12.2">
                  You may request account closure by contacting support@viewbeforeyoumove.com. Closure does not require deletion of information we must or are entitled to retain.
                </SubSection>
              </div>

              <Divider />

              {/* 13 */}
              <div id="privacy">
                <SectionTitle>13. Privacy, international access and cookies</SectionTitle>
                <SubSection id="13.1">
                  We process personal information in accordance with our Privacy Notice.
                </SubSection>
                <SubSection id="13.2">
                  When you submit an enquiry, we share it with the relevant estate agent because you have asked us to do so.
                </SubSection>
                <SubSection id="13.3">
                  Live production data must be kept separate from development and testing. Development and testing must use dummy, synthetic, anonymised or otherwise non-live information unless VBYM approves a documented exception following a privacy and security assessment. Production credentials, backups and identifiable production logs must not be exposed through development branches, preview deployments, personal messaging or AI coding tools.
                </SubSection>
                <SubSection id="13.4">
                  Routine Property capture, editing and media production remain with VBYM or approved UK-based personnel. VBYM may permit an approved overseas development and technical-support supplier to access production systems only where necessary and under written processing and international-transfer safeguards. Production access is restricted to specifically authorised named personnel and remains subject to VBYM account ownership, access revocation and incident control.
                </SubSection>
                <SubSection id="13.5">
                  We use cookies and similar technologies as described in our Cookie Policy.
                </SubSection>
              </div>

              <Divider />

              {/* 14 */}
              <div id="changes">
                <SectionTitle>14. Changes</SectionTitle>
                <SubSection id="14.1">
                  We may improve, update, replace or discontinue features and may update these Terms for changes in law, security, technology, functionality or business practice.
                </SubSection>
                <SubSection id="14.2">
                  Where a change materially affects registered users, we will give reasonable advance notice by an appropriate method where practicable.
                </SubSection>
                <SubSection id="14.3">
                  A change will not retrospectively remove an accrued consumer right or impose a new material payment obligation without your agreement where the law requires it.
                </SubSection>
              </div>

              <Divider />

              {/* 15 */}
              <div id="liability">
                <SectionTitle>15. Liability</SectionTitle>
                <SubSection id="15.1">
                  Nothing in these Terms excludes or limits liability where it would be unlawful to do so, including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation.
                </SubSection>
                <SubSection id="15.2">
                  We are responsible for loss or damage that is a foreseeable result of our breach of these Terms or our failure to use reasonable care and skill.
                </SubSection>
                <SubSection id="15.3">
                  We are not responsible for business losses, losses that were not reasonably foreseeable when you accepted these Terms, or loss caused by inaccurate third-party property information unless we failed to use reasonable care in the way we handled or presented that information.
                </SubSection>
                <SubSection id="15.4">
                  We are not responsible for loss that you could reasonably have avoided by following our instructions, carrying out the checks described in section 6 or using an up-to-date and properly secured device.
                </SubSection>
                <SubSection id="15.5">
                  If digital content supplied by us damages a device or other digital content because we failed to use reasonable care and skill, your statutory rights apply.
                </SubSection>
              </div>

              <Divider />

              {/* 16 */}
              <div id="contact">
                <SectionTitle>16. Complaints, law and contact</SectionTitle>
                <SubSection id="16.1">
                  Service complaints may be sent to support@viewbeforeyoumove.com. We will acknowledge and investigate them within a reasonable period.
                </SubSection>
                <SubSection id="16.2">
                  A data-protection complaint may be sent electronically to privacy@vbym.co.uk with the subject line &ldquo;Data Protection Complaint&rdquo;, or by post to our registered office. We will acknowledge receipt within 30 days, investigate without undue delay, keep you appropriately informed and tell you the outcome without undue delay.
                </SubSection>
                <SubSection id="16.3">
                  You may also complain to the Information Commissioner&rsquo;s Office. We ask that you contact us first where appropriate so that we have an opportunity to address the concern.
                </SubSection>
                <SubSection id="16.4">
                  These Terms are governed by the law of England and Wales. Consumers retain any mandatory right to bring proceedings in another UK jurisdiction where applicable.
                </SubSection>
                <SubSection id="16.5">
                  General and service contact: support@viewbeforeyoumove.com. Privacy contact: privacy@vbym.co.uk.
                </SubSection>
                <SubSection id="16.6">
                  Postal contact: View Before You Move Ltd, 10A King Street, Luton, England, LU1 2DP.
                </SubSection>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
