const navSections = [
  { id: "who-we-are", title: "1. Who we are" },
  { id: "data-we-collect", title: "2. Personal information we collect" },
  { id: "how-we-obtain", title: "3. How we obtain information" },
  { id: "purposes", title: "4. Purposes and lawful bases" },
  { id: "media-children", title: "5. Property media, incidental information and children" },
  { id: "ai-processing", title: "6. AI-assisted processing" },
  { id: "sharing", title: "7. Who we share information with" },
  { id: "uk-production", title: "8. UK production, approved technical support and service providers" },
  { id: "retention", title: "9. Retention" },
  { id: "cookies-marketing", title: "10. Cookies and direct marketing" },
  { id: "security", title: "11. Security" },
  { id: "your-rights", title: "12. Your rights" },
  { id: "complaints", title: "13. Data-protection complaints" },
  { id: "controllers-processors", title: "14. Controllers and processors" },
  { id: "changes-contact", title: "15. Changes and contact" },
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

function Divider() {
  return <div className="border-t border-gray-100 pt-6 mt-6" />;
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 text-[13.5px]">
      <div className="hidden bg-gray-50 font-semibold text-gray-800 sm:flex sm:flex-row">
        {headers.map((h, i) => (
          <div key={i} className="min-w-0 flex-1 border-b border-gray-200 px-3 py-2">
            {h}
          </div>
        ))}
      </div>
      {rows.map((cells, i) => (
        <div
          key={i}
          className={`flex flex-col gap-2 p-3 sm:flex-row sm:gap-0 sm:p-0 ${i % 2 === 1 ? "bg-gray-50/50" : ""} ${i < rows.length - 1 ? "border-b border-gray-100" : ""}`}
        >
          {cells.map((cell, j) => (
            <div key={j} className="min-w-0 sm:flex-1 sm:px-3 sm:py-2">
              <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 sm:hidden">
                {headers[j]}
              </p>
              <p className={j === 0 ? "align-top font-medium text-gray-700" : "align-top text-gray-600"}>
                {cell}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Privacy Notice
          </h1>
          <p className="mb-1 text-[14px] text-gray-500">
            For users, estate agents, vendors, occupiers, contractors and other individuals
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
                This Notice reflects the approved launch configuration and current processing arrangements. VBYM keeps the Notice under review and updates it where active providers, cookie tools, hosting arrangements, AI services, payment services, retention periods or international-transfer arrangements materially change.
              </p>

              {/* 1 */}
              <div id="who-we-are">
                <SectionTitle>1. Who we are</SectionTitle>
                <SubSection id="1.1">
                  View Before You Move Ltd (&ldquo;VBYM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) is the controller of Personal Data described in this Notice unless we state otherwise.
                </SubSection>
                <SubSection id="1.2">
                  We are registered in England and Wales under company number 16896041. Our registered office is 10A King Street, Luton, England, LU1 2DP.
                </SubSection>
                <SubSection id="1.3">
                  Contact privacy@vbym.co.uk for privacy matters.
                </SubSection>
                <SubSection id="1.4">
                  This Notice explains how we use information when you browse, create an account, search, enquire, act for an Agency, arrange or attend a capture, appear in media, work with us or otherwise interact with VBYM.
                </SubSection>
              </div>

              <Divider />

              {/* 2 — table: Personal information we collect */}
              <div id="data-we-collect">
                <SectionTitle>2. Personal information we collect</SectionTitle>
                <DataTable
                  headers={["Category", "Examples"]}
                  rows={[
                    ["Account and identity data", "Name, email, telephone, password hash, user ID, account type, authentication and verification status."],
                    ["Property-search data", "Searches, filters, saved properties, alerts, preferred areas and interactions."],
                    ["Enquiry and communication data", "Enquiry content, preferences, support messages, complaints, feedback and notes."],
                    ["Agency and professional data", "Agency name, role, office, work contacts, authority, branch, account users, onboarding, plan, credits and CRM information."],
                    ["Booking and access data", "Property address, appointment, vendor or occupier contact, electronic-signature status, authority and audit record, reminders, access instructions, parking, keys, hazards, pets and status."],
                    ["Property media", "Photographs, video, 360-degree footage, audio, floor plans, measurements, room labels and items visible or audible."],
                    ["Payment and transaction data", "Orders, invoices, amounts, VAT, payment status, provider references and limited billing information."],
                    ["Technical and usage data", "IP address, device, browser, identifiers, logs, pages viewed, errors, security events and media interactions."],
                    ["Location data", "Approximate IP location, search locations, property locations and service-area or appointment location where needed."],
                    ["Marketing data", "Preferences, consent records, campaign interactions and suppression records."],
                    ["Supplier and workforce data", "Professional contacts, identity verification, role, permissions, availability, allocation, access logs and contracts."],
                  ]}
                />
              </div>

              <Divider />

              {/* 3 */}
              <div id="how-we-obtain">
                <SectionTitle>3. How we obtain information</SectionTitle>
                <SubSection id="3.1">
                  We collect information directly when you create an account, search, save, enquire, book, order, upload, contact us, approve a listing, join a pilot or work with us.
                </SubSection>
                <SubSection id="3.2">
                  We may receive information from estate agents, vendors, landlords, occupiers, developers, CRM providers, payment providers, electronic-signature and communications providers, authentication services, analytics tools and approved suppliers.
                </SubSection>
                <SubSection id="3.3">
                  Where an Agency imports data, it is responsible for the appropriate lawful basis and privacy information.
                </SubSection>
                <SubSection id="3.4">
                  We may derive account status, service usage, interaction statistics, service area and security risk from information we hold.
                </SubSection>
              </div>

              <Divider />

              {/* 4 — intro para + table: Purposes and lawful bases */}
              <div id="purposes">
                <SectionTitle>4. Purposes and lawful bases</SectionTitle>
                <SubSection id="4.1">
                  We select the lawful basis for each purpose before processing begins. Contract applies only where the processing is necessary for a contract with the individual or steps they requested. Authority to record or publish is an operational permission and is not itself a UK GDPR lawful basis. Where we rely on legitimate interests, we document the purpose, necessity and impact on individuals.
                </SubSection>
                <DataTable
                  headers={["Purpose", "Data used", "Typical lawful basis"]}
                  rows={[
                    ["Provide accounts, saved searches and alerts", "Account, search, technical and preference data", "Contract where needed to provide a registered-user service; legitimate interests in providing requested functionality and operating the Platform."],
                    ["Send enquiries to agents", "Name, contacts, message, property and metadata", "Legitimate interests in transmitting and managing the enquiry requested by the sender; contract or steps requested where applicable."],
                    ["Onboard Agencies, Orders and billing", "Agency, identity, transaction and communications", "Contract with the Agency; legal obligations for tax, accounting and compliance; legitimate interests in administration, verification and fraud prevention."],
                    ["Arrange Capture Appointments, authority and preparation", "Booking, contact, authority, signature status, communications, access, location, safety and Property data", "Contract with the Agency; legitimate interests in arranging an authorised appointment safely and efficiently, obtaining and evidencing operational authority, and providing preparation information."],
                    ["Process media and create drafts", "Media, audio, measurements, Agency Content and approvals", "Contract with the Agency; legitimate interests in creating authorised property-marketing materials, subject to privacy safeguards."],
                    ["Publish and host listings", "Property data, media, agent details and approvals", "Contract with the Agency; legitimate interests in authorised property marketing and Platform operation. Consent is used only for optional promotional uses where consent is the appropriate basis."],
                    ["Operate CRM and exports", "Listing, account, CRM, audit and media data", "Contract with the Agency; legitimate interests in operating authorised integrations and maintaining audit records."],
                    ["Develop, maintain and support the Platform", "Technical, account, listing, media, logs and support data", "Contract where applicable; legitimate interests in reliable, secure and supported Platform operation."],
                    ["Security and fraud prevention", "Account, identity, technical, payment and communications", "Legitimate interests in security and fraud prevention; legal obligation where a specific law requires processing."],
                    ["Support, complaints and legal rights", "Account, communications, orders and evidence", "Contract where applicable; legitimate interests in support, complaint handling and legal claims; legal obligation where applicable."],
                    ["Analytics and improvement", "Usage, technical and aggregated data", "Consent where required for storage/access technologies; otherwise legitimate interests in service measurement and improvement, using minimised or aggregated data where practical."],
                    ["Direct marketing", "Contacts, role, preferences and campaign interactions", "Consent where required for individual marketing; otherwise legitimate interests for proportionate business-to-business marketing, subject to the right to object."],
                    ["Legal compliance", "Relevant categories", "Legal obligation where a specific duty applies; legitimate interests in establishing, exercising or defending legal claims."],
                  ]}
                />
              </div>

              <Divider />

              {/* 5 */}
              <div id="media-children">
                <SectionTitle>5. Property media, incidental information and children</SectionTitle>
                <SubSection id="5.1">
                  Media may incidentally record people, voices, family photographs, documents, screens, number plates, security devices, artwork or belongings.
                </SubSection>
                <SubSection id="5.2">
                  The Agency is responsible for confirming its authority to market the Property, arrange access and provide the relevant contact details. VBYM will normally send a direct electronic Property Media Capture and Publication Authority to the vendor, owner, landlord or authorised occupier, copy the Agency contact into the initial communication or provide equivalent status visibility, and send reminders where appropriate.
                </SubSection>
                <SubSection id="5.3">
                  The initial authority email may contain concise preparation and privacy information. Once the Authority is signed, VBYM will normally send the signatory and Agency a confirmation and the full Vendor Filming Preparation Guide. The Agency remains responsible for monitoring and chasing an unsigned Authority before the appointment.
                </SubSection>
                <SubSection id="5.4">
                  We do not intentionally collect Special Category Data through ordinary capture. Such information should be removed or concealed.
                </SubSection>
                <SubSection id="5.5">
                  We may restrict, blur, replace or delete sensitive information where reasonably practical.
                </SubSection>
                <SubSection id="5.6">
                  Children should not create accounts or appear in media without appropriate authority and safeguards.
                </SubSection>
              </div>

              <Divider />

              {/* 6 */}
              <div id="ai-processing">
                <SectionTitle>6. AI-assisted processing</SectionTitle>
                <SubSection id="6.1">
                  We may use AI-assisted tools to create draft descriptions, organise content, identify quality issues or support internal workflows.
                </SubSection>
                <SubSection id="6.2">
                  AI-generated property descriptions are drafts requiring human and Agency review.
                </SubSection>
                <SubSection id="6.3">
                  We do not use solely automated decisions producing legal or similarly significant effects.
                </SubSection>
                <SubSection id="6.4">
                  We minimise information sent to AI providers and use settings and contracts intended to prevent use for general model training where available.
                </SubSection>
              </div>

              <Divider />

              {/* 7 — table: Who we share information with */}
              <div id="sharing">
                <SectionTitle>7. Who we share information with</SectionTitle>
                <DataTable
                  headers={["Recipient category", "Why information may be shared"]}
                  rows={[
                    ["Estate and letting agents", "Enquiries, account and listing interactions and Agency relationship management."],
                    ["Vendors, landlords and occupiers", "Appointment, direct electronic authority, preparation guidance, confirmation and issue-resolution information."],
                    ["Supabase and approved infrastructure providers", "Database, authentication and related Platform infrastructure."],
                    ["Payment providers", "Payment, billing and fraud prevention."],
                    ["Cloud, hosting, storage, CDN and backup providers", "Platform data, media and technical logs needed to host and secure the service."],
                    ["Email, electronic-signature, messaging and support providers", "Authority links, service messages, reminders, preparation guidance, signature status and support."],
                    ["Maps and location providers", "Addresses or location queries for maps, search and service-area functions."],
                    ["CRM, feed and portal providers", "Authorised imports, write-back or distribution."],
                    ["Analytics and security providers", "Technical, usage and security data, subject to cookie consent where required."],
                    ["AI and media-processing tools", "Limited content and media for approved processing, editing or draft generation."],
                    ["UK production personnel", "Information needed for capture, processing, quality control and publication."],
                    ["Approved VBYM personnel and software-development/technical-support supplier", "Access is limited according to role and least privilege. Cyber Nexus is based in Pakistan; production access is restricted to Abdul Kabeer, while Fiza Asad and Hassan Omar have GitHub development access only. Development and testing use non-live data, and live access is governed by the applicable DPA, UK international-transfer safeguard, approved Data Protection Test and VBYM access controls."],
                    ["Professional advisers, insurers, regulators and authorities", "Advice, insurance, legal compliance, claims, fraud prevention or law enforcement."],
                    ["Business purchasers", "Information relevant to a genuine merger, investment, restructuring or sale, subject to safeguards."],
                  ]}
                />
              </div>

              <Divider />

              {/* 8 */}
              <div id="uk-production">
                <SectionTitle>8. UK production, approved technical support and service providers</SectionTitle>
                <SubSection id="8.1">
                  Routine Property capture, media editing, processing, room labelling, floor-plan preparation, draft-description creation and draft-listing preparation are performed in the United Kingdom by VBYM employees or approved UK-based workers or contractors.
                </SubSection>
                <SubSection id="8.2">
                  The same suitably trained UK-based person may perform capture and subsequent processing/editing.
                </SubSection>
                <SubSection id="8.3">
                  VBYM retains ownership and control of the principal production accounts, recovery methods and access approvals. Approved live technical administration may be performed by Cyber Nexus (SMC-Private) Limited through Abdul Kabeer, who is the only Cyber Nexus person currently authorised for production access.
                </SubSection>
                <SubSection id="8.4">
                  Cyber Nexus develops and maintains the Platform under the existing MSA and SOW, as novated to Cyber Nexus. Fiza Asad and Hassan Omar are approved Cyber Nexus contractors with GitHub development access only and no authority to access production Personal Data, live databases, storage, credentials or administrative systems.
                </SubSection>
                <SubSection id="8.5">
                  Development and testing must use dummy, synthetic, anonymised or otherwise non-live information and must not use or modify live production records. Where a live issue requires technical support, access is limited to the minimum necessary, uses individual accounts and multi-factor authentication, and is subject to VBYM authorisation, logging where available, incident controls and applicable processing and international-transfer terms.
                </SubSection>
                <SubSection id="8.6">
                  We may use approved hosting, database, authentication, payment, communications, electronic-signature, booking, monitoring, security, backup and support providers. Some providers may process information outside the United Kingdom or permit support access from another country.
                </SubSection>
                <SubSection id="8.7">
                  Where use of an active provider involves a restricted international transfer, VBYM will use an appropriate safeguard recognised under UK data-protection law and will carry out the required assessment and supplementary measures.
                </SubSection>
                <SubSection id="8.8">
                  We maintain internal records of active providers, processing purposes, locations and safeguards and review them when the live technology stack changes.
                </SubSection>
              </div>

              <Divider />

              {/* 9 — table: Retention */}
              <div id="retention">
                <SectionTitle>9. Retention</SectionTitle>
                <DataTable
                  headers={["Record", "Typical retention"]}
                  rows={[
                    ["Consumer account", "While active, then normally deleted or anonymised within 24 months after closure unless needed for disputes, security or law."],
                    ["Property enquiries", "Normally up to 24 months after the enquiry."],
                    ["Agency contracts, Orders, invoices and payments", "Normally 6 years after the relevant financial year or relationship."],
                    ["Booking and access records", "Normally 3 years after the appointment, longer where needed for safety, disputes or claims."],
                    ["Raw Property media", "Normally 90 days after final approval or delivery unless rework, backup, dispute or legal hold requires longer."],
                    ["Processed assets and immersive content", "While the listing or hosting is active. Founder PAYG immersive hosting is normally included for 12 months from first publication or until sold, let or withdrawn, followed by any agreed renewal or restricted archive and deletion process."],
                    ["Agent approval and authority records", "Normally 6 years after the relevant listing or service ends."],
                    ["Support and complaint records", "Normally 3 years after closure, and longer where reasonably necessary for a legal claim, regulator enquiry or documented complaint outcome."],
                    ["Security and technical logs", "Normally up to 12 months, longer where needed for investigation or security."],
                    ["Production-administrator access and audit records", "Normally at least 24 months after the access or deployment event, and longer where required for investigation, contract evidence or regulatory accountability."],
                    ["Marketing preferences", "Until objection or withdrawal, with a minimal suppression record."],
                    ["Cookie and consent records", "For the duration stated in the Cookie Policy and consent tool."],
                  ]}
                />
              </div>

              <Divider />

              {/* 10 */}
              <div id="cookies-marketing">
                <SectionTitle>10. Cookies and direct marketing</SectionTitle>
                <SubSection id="10.1">
                  Strictly necessary storage and access technologies support authentication, security, requested communications and features you ask to use.
                </SubSection>
                <SubSection id="10.2">
                  We may use limited statistical, appearance or other technologies without consent only where a statutory exception applies, the required information and safeguards are provided and a simple means of objecting is available where required. Other non-essential analytics or advertising technologies are activated only after valid consent.
                </SubSection>
                <SubSection id="10.3">
                  We do not sell Personal Data.
                </SubSection>
                <SubSection id="10.4">
                  You may unsubscribe or object to marketing at any time. Service messages are not marketing.
                </SubSection>
                <SubSection id="10.5">
                  The Cookie Policy and consent tool identify the technologies in use, their providers, purposes, duration, legal position and available controls. Consent choices are recorded and can be changed or withdrawn.
                </SubSection>
              </div>

              <Divider />

              {/* 11 */}
              <div id="security">
                <SectionTitle>11. Security</SectionTitle>
                <SubSection id="11.1">
                  We use measures designed to protect information, including role-based access, authentication, encryption where appropriate, logging, backups, supplier controls and incident procedures.
                </SubSection>
                <SubSection id="11.2">
                  Production access is restricted to specifically authorised VBYM personnel and approved named supplier personnel using individual accounts, multi-factor authentication and least-privilege permissions. Live production data is kept separate from development and testing, and production credentials, backups and identifiable logs are limited to people whose authorised duties require them.
                </SubSection>
                <SubSection id="11.3">
                  No online service is completely secure. Users must protect passwords and notify us of suspected compromise.
                </SubSection>
                <SubSection id="11.4">
                  We notify the ICO and affected individuals where legally required following a Personal Data Breach.
                </SubSection>
              </div>

              <Divider />

              {/* 12 */}
              <div id="your-rights">
                <SectionTitle>12. Your rights</SectionTitle>
                <SubSection id="12.1">
                  Depending on the circumstances and lawful basis, you may have rights of access, correction, erasure, restriction, objection, portability, withdrawal of consent and complaint.
                </SubSection>
                <SubSection id="12.2">
                  To exercise a right, contact privacy@vbym.co.uk. We may request proportionate information needed to verify identity and locate the relevant records.
                </SubSection>
                <SubSection id="12.3">
                  Rights are not absolute and lawful exemptions or retention duties may apply.
                </SubSection>
                <SubSection id="12.4">
                  <span className="font-semibold text-gray-800">IMPORTANT — RIGHT TO OBJECT:</span> where we rely on legitimate interests, you may object to that processing. You have an absolute right to object to processing for direct marketing.
                </SubSection>
              </div>

              <Divider />

              {/* 13 */}
              <div id="complaints">
                <SectionTitle>13. Data-protection complaints</SectionTitle>
                <SubSection id="13.1">
                  You may make a data-protection complaint by emailing privacy@vbym.co.uk with the subject line &ldquo;Data Protection Complaint&rdquo;, or by writing to our registered office.
                </SubSection>
                <SubSection id="13.2">
                  We will acknowledge receipt within 30 days. We will take appropriate steps to investigate without undue delay, keep you appropriately informed and communicate the outcome without undue delay.
                </SubSection>
                <SubSection id="13.3">
                  A complaint should include your name and contact details, a description of the concern, relevant dates and any outcome you are seeking. Please do not send unnecessary identity documents or sensitive information by ordinary email.
                </SubSection>
                <SubSection id="13.4">
                  You may complain to the Information Commissioner&rsquo;s Office at any time. Contacting us first may allow the concern to be resolved more quickly.
                </SubSection>
              </div>

              <Divider />

              {/* 14 */}
              <div id="controllers-processors">
                <SectionTitle>14. Controllers and processors</SectionTitle>
                <SubSection id="14.1">
                  When an estate agent receives and handles an enquiry for its own purposes, it is normally a separate controller.
                </SubSection>
                <SubSection id="14.2">
                  Where VBYM processes data only on Agency instructions, the Agency is controller and VBYM is processor.
                </SubSection>
                <SubSection id="14.3">
                  Where VBYM determines its own purposes for Platform operation, security, billing, legal compliance, analytics or marketing, VBYM is controller.
                </SubSection>
                <SubSection id="14.4">
                  Approved live-service providers and Cyber Nexus may act as processors to VBYM and may act as subprocessors in relation to Agency-controlled data. Written processing terms, subprocessor authorisation and any required international-transfer safeguards apply. VBYM remains responsible for selecting, instructing and monitoring its processors.
                </SubSection>
              </div>

              <Divider />

              {/* 15 */}
              <div id="changes-contact">
                <SectionTitle>15. Changes and contact</SectionTitle>
                <SubSection id="15.1">
                  We may update this Notice to reflect changes in law, systems, suppliers, data flows or business practice.
                </SubSection>
                <SubSection id="15.2">
                  Material changes will be communicated by an appropriate notice.
                </SubSection>
                <SubSection id="15.3">
                  Privacy contact: privacy@vbym.co.uk. Postal address: View Before You Move Ltd, 10A King Street, Luton, England, LU1 2DP.
                </SubSection>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
