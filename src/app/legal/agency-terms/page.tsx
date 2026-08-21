const navSections = [
  { id: "parties", title: "1. Parties, scope and contract documents" },
  { id: "definitions", title: "2. Definitions" },
  { id: "eligibility", title: "3. Agency eligibility, verification and account security" },
  { id: "services", title: "4. Services and service development" },
  { id: "free-listings", title: "5. Free and imported listings" },
  { id: "media-pack-orders", title: "6. Media-pack Orders" },
  { id: "capture-appointments", title: "7. Capture Appointments" },
  { id: "authority-privacy", title: "8. Authority, privacy and preparation" },
  { id: "upload-production", title: "9. Upload, production location, technical access and turnaround" },
  { id: "draft-review", title: "10. Draft review, amendments and approval" },
  { id: "crm", title: "11. CRM, feeds and third-party dependencies" },
  { id: "prices", title: "12. Prices, VAT and payment" },
  { id: "subscriptions", title: "13. Subscriptions and credits" },
  { id: "cancellation", title: "14. Cancellation, rescheduling, failed access and refunds" },
  { id: "agency-responsibilities", title: "15. Agency responsibilities and compliance" },
  { id: "ip-media-rights", title: "16. Intellectual property and media rights" },
  { id: "agency-content", title: "17. Agency Content and optional marketing use" },
  { id: "data-protection-roles", title: "18. Data protection roles" },
  { id: "security-incidents", title: "19. Security and incidents" },
  { id: "confidentiality", title: "20. Confidentiality" },
  { id: "warranties", title: "21. Warranties and disclaimers" },
  { id: "liability", title: "22. Liability" },
  { id: "insurance", title: "23. Insurance, safety and force majeure" },
  { id: "hosting", title: "24. Hosting, withdrawal and retention" },
  { id: "suspension-termination", title: "25. Suspension and termination" },
  { id: "notices", title: "26. Notices, assignment and subcontracting" },
  { id: "general", title: "27. General" },
  { id: "governing-law", title: "28. Governing law, jurisdiction and contact" },
  { id: "schedule-1", title: "Schedule 1 — Minimum Order Form information" },
  { id: "schedule-2", title: "Schedule 2 — General Processor and Subprocessor Authorisation" },
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

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-3 ml-4 space-y-1.5 list-disc marker:text-gray-400">
      {items.map((item, i) => (
        <li key={i} className="text-[14px] leading-relaxed text-gray-600">{item}</li>
      ))}
    </ul>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mb-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h, i) => (
              <th key={i} className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-800">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : undefined}>
              {cells.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "border-b border-gray-100 px-3 py-2 align-top font-medium text-gray-700 whitespace-nowrap"
                      : "border-b border-gray-100 px-3 py-2 align-top text-gray-600"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefTable({ rows }: { rows: { term: React.ReactNode; meaning: React.ReactNode }[] }) {
  return (
    <div className="mb-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-800">Defined term</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-800">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : undefined}>
              <td className="border-b border-gray-100 px-3 py-2 align-top font-medium text-gray-700 whitespace-nowrap">{r.term}</td>
              <td className="border-b border-gray-100 px-3 py-2 align-top text-gray-600">{r.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AgencyTermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Agency Terms of Business
          </h1>
          <p className="mb-1 text-[14px] text-gray-500">
            For estate agents, letting agents, developers and other professional property clients
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
                These are business-to-business terms. Each Agency should also sign or accept an Order Form setting out the selected Services, fees, term, service area and any Founder Pilot concessions.
              </p>

              {/* 1 */}
              <div id="parties">
                <SectionTitle>1. Parties, scope and contract documents</SectionTitle>
                <SubSection id="1.1">
                  These Agency Terms of Business (&ldquo;Terms&rdquo;) are entered into between View Before You Move Ltd (&ldquo;VBYM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) and the professional customer identified in an Order Form (&ldquo;Agency&rdquo;, &ldquo;you&rdquo; or &ldquo;your&rdquo;).
                </SubSection>
                <SubSection id="1.2">
                  These Terms govern free or paid listings, Subscriptions, pay-as-you-go media packs, property capture, media processing, publication, CRM connectivity, export packs and related business services.
                </SubSection>
                <SubSection id="1.3">
                  If the contract documents conflict, an applicable Data Processing Schedule prevails for data-protection matters; any mandatory international-transfer terms applicable to an active service provider prevail for that transfer; the Order Form prevails for Agency-specific Services, prices, dates, capacity and service area; and these Terms apply in all other respects. No document overrides a mandatory legal requirement.
                </SubSection>
                <SubSection id="1.4">
                  A contract is formed when we accept an Order, confirm a booking, begin work or otherwise confirm acceptance.
                </SubSection>
                <SubSection id="1.5">
                  You confirm that you act wholly for business purposes and the person accepting the contract has authority to bind the Agency.
                </SubSection>
              </div>

              <Divider />

              {/* 2 */}
              <div id="definitions">
                <SectionTitle>2. Definitions</SectionTitle>
                <DefTable
                  rows={[
                    { term: "Agency Content", meaning: "Property details, prices, addresses, instructions, logos, existing media, documents and other materials supplied by or for the Agency." },
                    { term: "Approved Listing", meaning: "A listing and associated media expressly approved by the Agency for publication." },
                    { term: "Business Day", meaning: "A day other than Saturday, Sunday or a public holiday in England when banks in London are open." },
                    { term: "Capture Appointment", meaning: "A booked visit for photography, 360-degree capture, video, measurements, floor-plan capture, notes or related work." },
                    { term: "Full Immersive 360-degree Experience", meaning: "The complete moving or interactive 360-degree property experience processed and hosted by VBYM." },
                    { term: "Order", meaning: "An accepted order for a Subscription, media pack, listing service, capture service or other Service." },
                    { term: "Platform", meaning: "VBYM websites, portals, dashboards, software, applications, hosting and processing workflows." },
                    { term: "Raw Materials", meaning: "Unedited 360-degree files, source photographs, audio, video, measurement files, projects and working files." },
                    { term: "Standard Media-Pack Assets", meaning: "Final processed stills, standard MP4 walkthrough, standard marketing floor plan and approved description included in the Order." },
                    { term: "Subscription", meaning: "A recurring plan for Platform access, listings, media-pack credits or other Services." },
                  ]}
                />
              </div>

              <Divider />

              {/* 3 */}
              <div id="eligibility">
                <SectionTitle>3. Agency eligibility, verification and account security</SectionTitle>
                <SubSection id="3.1">
                  You must be professionally authorised to market each Property and comply with applicable laws, codes and material-information requirements.
                </SubSection>
                <SubSection id="3.2">
                  We may request information to verify the Agency, its personnel, ownership, payment details and authority. Activation may be delayed until verification is complete.
                </SubSection>
                <SubSection id="3.3">
                  Each user must have an individual login, appropriate password and multi-factor authentication where offered, with access limited to their role.
                </SubSection>
                <SubSection id="3.4">
                  You must notify us promptly of departures, suspected compromise or any need to revoke access.
                </SubSection>
              </div>

              <Divider />

              {/* 4 */}
              <div id="services">
                <SectionTitle>4. Services and service development</SectionTitle>
                <SubSection id="4.1">
                  Services may include free listings, paid media packs, Capture Appointments, upload and processing, draft-listing preparation, approval, publication, enquiries, Subscriptions, CRM imports or write-back and export packs.
                </SubSection>
                <SubSection id="4.2">
                  The exact Services, volumes, areas, credits, integrations, targets and prices are those stated in the Order Form.
                </SubSection>
                <SubSection id="4.3">
                  A planned, beta, pilot, preview or third-party-dependent feature is not a guaranteed live deliverable unless expressly identified with acceptance criteria.
                </SubSection>
                <SubSection id="4.4">
                  During a Founder Pilot, both parties will act reasonably to test and refine workflows.
                </SubSection>
              </div>

              <Divider />

              {/* 5 */}
              <div id="free-listings">
                <SectionTitle>5. Free and imported listings</SectionTitle>
                <SubSection id="5.1">
                  Where free listing of existing stock is offered, the Agency may submit or authorise import of qualifying listings using Agency Content.
                </SubSection>
                <SubSection id="5.2">
                  Free listing does not include a new media pack, Capture Appointment, guaranteed placement, traffic, leads or permanent publication unless expressly stated.
                </SubSection>
                <SubSection id="5.3">
                  We may reject, suspend, correct, archive or remove incomplete, outdated, duplicated, unlawful, misleading, unsuitable or unauthorised content.
                </SubSection>
                <SubSection id="5.4">
                  The Agency remains responsible for current status, price and material information and for prompt withdrawal.
                </SubSection>
              </div>

              <Divider />

              {/* 6 */}
              <div id="media-pack-orders">
                <SectionTitle>6. Media-pack Orders</SectionTitle>
                <SubSection id="6.1">
                  An Order may include a Capture Appointment, Full Immersive 360-degree Experience, MP4 walkthrough, processed photographs, floor plan, draft description, draft listing, approval workflow, publication, CRM return and export pack.
                </SubSection>
                <SubSection id="6.2">
                  Included outputs, image assumptions, property-size limits, revisions and premium surcharges are stated in the Order Form.
                </SubSection>
                <SubSection id="6.3">
                  Where a Property materially exceeds standard assumptions or requires more travel, access, capture or processing, we may propose an additional fee before doing that additional work.
                </SubSection>
                <SubSection id="6.4">
                  No additional amount is charged without agreement unless clearly stated in the Order Form or booking terms.
                </SubSection>
              </div>

              <Divider />

              {/* 7 */}
              <div id="capture-appointments">
                <SectionTitle>7. Capture Appointments</SectionTitle>
                <SubSection id="7.1">
                  Appointments are booked in service windows and do not guarantee completion of unlimited work at unusually large, inaccessible or unprepared Properties.
                </SubSection>
                <SubSection id="7.2">
                  The Agency must confirm the appointment and supply accurate address, access, parking, vendor or authorised occupier contact details, alarm, pet, hazard and Property information. The Agency confirms that it may lawfully provide those contact details to VBYM for appointment administration, authority, reminders and preparation communications.
                </SubSection>
                <SubSection id="7.3">
                  The Property must be safe, prepared, accessible and ready to record.
                </SubSection>
                <SubSection id="7.4">
                  An executive may refuse or stop work for safety, threatening behaviour, illegal activity, uncontrolled animals, serious hygiene issues, lack of authority or other unreasonable conditions.
                </SubSection>
                <SubSection id="7.5">
                  Failed-access, cancellation or revisit charges in the Order Form may apply.
                </SubSection>
              </div>

              <Divider />

              {/* 8 */}
              <div id="authority-privacy">
                <SectionTitle>8. Authority, privacy and preparation</SectionTitle>
                <SubSection id="8.1">
                  Before capture, the Agency must obtain permissions needed for access, recording, UK-based media processing, publication and use of the resulting media.
                </SubSection>
                <SubSection id="8.2">
                  Children and vulnerable persons must not be recorded without appropriate authority and safeguards.
                </SubSection>
                <SubSection id="8.3">
                  The Agency and vendor must remove or conceal private items, including identity documents, medication, financial information, security codes, screens and valuable collections.
                </SubSection>
                <SubSection id="8.4">
                  VBYM will use reasonable efforts to identify obvious privacy concerns but does not guarantee every item will be detected.
                </SubSection>
                <SubSection id="8.5">
                  The Agency must use the Property Media Capture and Publication Authority or an approved equivalent. The standard workflow is direct electronic signature by the vendor, owner, landlord or authorised occupier before capture.
                </SubSection>
                <SubSection id="8.6">
                  When booking a Capture Appointment, the Agency must provide the proposed signatory&rsquo;s accurate name and contact details. VBYM may send the Authority electronically, copy the Agency contact into the initial communication or provide equivalent live status visibility, and send automated reminders and preparation information.
                </SubSection>
                <SubSection id="8.7">
                  The Agency is responsible for monitoring whether the Authority has been signed and for chasing the proposed signatory before the Capture Appointment. Automated reminders from VBYM do not transfer that responsibility to VBYM.
                </SubSection>
                <SubSection id="8.8">
                  VBYM will normally provide concise preparation and privacy points in the initial authority email. Once the Authority is signed, VBYM will normally send the signatory and Agency a confirmation and the full Vendor Filming Preparation Guide.
                </SubSection>
                <SubSection id="8.9">
                  Capture must not begin unless VBYM has received the signed direct Authority or has expressly accepted the Agency-only route and the Agency has confirmed that equivalent written authority is held.
                </SubSection>
                <SubSection id="8.10">
                  The Agency warrants that it has obtained and will retain written authority from every owner, landlord, tenant, occupier or other person whose permission is reasonably required for entry, recording, processing, technical access and publication. Where the Agency-only route is used, the Agency must identify the basis and location of the underlying authority and provide a copy promptly on request.
                </SubSection>
                <SubSection id="8.11">
                  The Agency indemnifies VBYM against third-party claims, reasonable losses and reasonable professional costs arising from a material breach of sections 8 or 15, except to the extent caused by VBYM&rsquo;s own breach, negligence or unlawful act.
                </SubSection>
              </div>

              <Divider />

              {/* 9 */}
              <div id="upload-production">
                <SectionTitle>9. Upload, production location, technical access and turnaround</SectionTitle>
                <SubSection id="9.1">
                  Collected media must be uploaded promptly to the correct Property workspace. Missing facts, branding and instructions must be supplied before the draft can be completed.
                </SubSection>
                <SubSection id="9.2">
                  The turnaround target starts only after capture, successful upload, complete required information and valid payment or credit.
                </SubSection>
                <SubSection id="9.3">
                  A 24-48 Business Hour period is a target, not a guarantee, and excludes weekends and English public holidays unless expressly stated.
                </SubSection>
                <SubSection id="9.4">
                  Routine capture, editing, media processing, room labelling, floor-plan preparation, draft-description creation and draft-listing preparation are performed in the United Kingdom by VBYM employees or approved UK-based workers or contractors.
                </SubSection>
                <SubSection id="9.5">
                  The same suitably trained UK-based Production Executive may carry out capture, upload, processing and editing.
                </SubSection>
                <SubSection id="9.6">
                  VBYM retains ownership and control of the principal production accounts, recovery routes and access approvals. Approved production deployment and technical administration may be carried out by Cyber Nexus (SMC-Private) Limited through Abdul Kabeer, who is the only Cyber Nexus person currently authorised for production access. Any additional supplier production access requires VBYM&rsquo;s prior written approval and completion of the applicable contractual, security and data-protection steps.
                </SubSection>
                <SubSection id="9.7">
                  Cyber Nexus develops and maintains the Platform under the existing MSA and SOW, as novated to Cyber Nexus. Code changes must be developed in approved branches, reviewed and tested using non-live data, recorded against the release checklist and deployed through VBYM-controlled accounts. Fiza Asad and Hassan Omar are approved Cyber Nexus contractors with GitHub development access only and no authority to access production Personal Data, databases, storage, credentials or live administrative systems.
                </SubSection>
                <SubSection id="9.8">
                  Development and testing do not use or modify live production records. VBYM maintains a separate live production database from the database used for development and testing. Active row-level-security or equivalent controls protect live tables and private storage, and production access is limited to what is necessary for an authorised technical task.
                </SubSection>
              </div>

              <Divider />

              {/* 10 */}
              <div id="draft-review">
                <SectionTitle>10. Draft review, amendments and approval</SectionTitle>
                <SubSection id="10.1">
                  The Agency must review the draft listing, media, room labels, measurements, description and material information before publication.
                </SubSection>
                <SubSection id="10.2">
                  The Agency is responsible for verifying all factual and legal information.
                </SubSection>
                <SubSection id="10.3">
                  We will not publish an enhanced listing until express Agency approval is recorded, unless a separate automated approval process has been agreed.
                </SubSection>
                <SubSection id="10.4">
                  Corrections caused by our processing error are included. New directions, late changes, additional assets or extensive re-editing may be chargeable.
                </SubSection>
              </div>

              <Divider />

              {/* 11 */}
              <div id="crm">
                <SectionTitle>11. CRM, feeds and third-party dependencies</SectionTitle>
                <SubSection id="11.1">
                  CRM/API access is subject to provider permissions, charges, rules and availability.
                </SubSection>
                <SubSection id="11.2">
                  Direct write-back is not guaranteed unless expressly included as an accepted deliverable.
                </SubSection>
                <SubSection id="11.3">
                  The standard fallback is a structured export pack for manual Agency upload.
                </SubSection>
                <SubSection id="11.4">
                  Agency-side CRM, API, feed, portal, marketplace and enablement fees are paid by the Agency unless expressly included.
                </SubSection>
              </div>

              <Divider />

              {/* 12 */}
              <div id="prices">
                <SectionTitle>12. Prices, VAT and payment</SectionTitle>
                <SubSection id="12.1">
                  Prices exclude VAT unless stated otherwise.
                </SubSection>
                <SubSection id="12.2">
                  PAYG Orders are payable in full at booking unless credit terms are agreed.
                </SubSection>
                <SubSection id="12.3">
                  Subscription fees are payable monthly in advance by the approved recurring payment method. Subscription credits are issued only after cleared payment. We may suspend new Orders, downloads or publication while sums are overdue.
                </SubSection>
                <SubSection id="12.4">
                  We may claim statutory interest, fixed compensation and reasonable recovery costs on overdue business debts where applicable.
                </SubSection>
              </div>

              <Divider />

              {/* 13 */}
              <div id="subscriptions">
                <SectionTitle>13. Subscriptions and credits</SectionTitle>
                <SubSection id="13.1">
                  The Founder launch Subscription plans are: Founder Starter at GBP 449 plus VAT per month for three media-pack credits; Founder Growth at GBP 699 plus VAT per month for five credits; and Founder Scale at GBP 1,199 plus VAT per month for ten credits. The selected plan must be recorded in the Order Form.
                </SubSection>
                <SubSection id="13.2">
                  Unless the Order Form states otherwise, a Subscription has an initial minimum term of three consecutive monthly billing periods. It then continues monthly until either party gives at least 30 days written notice. Cancellation takes effect at the end of the applicable paid billing period.
                </SubSection>
                <SubSection id="13.3">
                  One credit covers one Standard Property media pack. Premium surcharges, Bespoke quotations, exceptional travel, third-party charges and optional add-ons remain payable in addition to the monthly Subscription fee.
                </SubSection>
                <SubSection id="13.4">
                  Unused credits may roll into the immediately following billing month only. The maximum rolled balance is one normal month&rsquo;s allowance for the selected plan. Oldest credits are used first, and any credit not used by the end of the following billing month expires automatically.
                </SubSection>
                <SubSection id="13.5">
                  Credits have no cash value, are not refundable or transferable, and are available only to the participating branch unless VBYM agrees otherwise in writing.
                </SubSection>
                <SubSection id="13.6">
                  Credits do not reserve Capture Appointments or guarantee capacity. All bookings remain subject to VBYM&rsquo;s operational capacity, service area and appointment availability.
                </SubSection>
                <SubSection id="13.7">
                  Media packs above the available monthly and rolled credit balance are charged at the prevailing PAYG price unless the Order Form states another overage price. The Founder PAYG rate is GBP 159 plus VAT while that branch remains eligible; the ordinary reference price is GBP 199 plus VAT afterwards.
                </SubSection>
                <SubSection id="13.8">
                  An upgrade may take effect from the next billing date, or earlier on a pro-rated basis where VBYM agrees and capacity permits. A downgrade takes effect only after the initial minimum term and applicable notice period. The rollover cap then adjusts to the new plan.
                </SubSection>
                <SubSection id="13.9">
                  If a payment fails, VBYM may retry collection and allow a grace period of up to seven days. No new credits are issued until payment clears, and VBYM may pause new bookings, publication, downloads or other Subscription Services while payment remains overdue.
                </SubSection>
                <SubSection id="13.10">
                  A media pack ordered, booked or captured before cancellation remains payable and uses the relevant credit or PAYG charge. Except where VBYM materially fails to provide the contracted Service, there is no refund for an unused part of a billing month or expired credit.
                </SubSection>
                <SubSection id="13.11">
                  Founder Subscription pricing applies during the participating branch&rsquo;s 12-month Founder Pilot. The 20-completed-pack expiry rule applies to the Founder PAYG price and does not shorten an active Founder Subscription. At the end of the Pilot, VBYM may offer the then-current standard Subscription or PAYG pricing on at least 30 days notice.
                </SubSection>
                <SubSection id="13.12">
                  Ending a Subscription does not remove the perpetual licence to fully paid Standard Media-Pack Assets. Each media pack purchased using a Subscription credit receives the hosting period stated in the Order Form, regardless of later Subscription cancellation, subject to sold, let, withdrawn, takedown and legal-retention provisions.
                </SubSection>
              </div>

              <Divider />

              {/* 14 */}
              <div id="cancellation">
                <SectionTitle>14. Cancellation, rescheduling, failed access and refunds</SectionTitle>
                <SubSection id="14.1">
                  Cancellation and rescheduling charges are those shown in the Order Form or booking page.
                </SubSection>
                <SubSection id="14.2">
                  Charges may apply where notice is late, travel has begun, a slot cannot be reallocated or work has started.
                </SubSection>
                <SubSection id="14.3">
                  If we cancel for reasons within our control, we will offer a replacement appointment or refund the affected capture charge.
                </SubSection>
                <SubSection id="14.4">
                  After capture or processing begins, there is no automatic full refund; refunds reflect work supplied and committed costs.
                </SubSection>
              </div>

              <Divider />

              {/* 15 */}
              <div id="agency-responsibilities">
                <SectionTitle>15. Agency responsibilities and compliance</SectionTitle>
                <SubSection id="15.1">
                  The Agency warrants that it is authorised to market each Property and provide all Agency Content.
                </SubSection>
                <SubSection id="15.2">
                  The Agency is responsible for accuracy, legality, currency, material information and compliance with consumer-protection, advertising, equality and professional rules.
                </SubSection>
                <SubSection id="15.3">
                  The Agency must not submit misleading, defamatory, discriminatory, obscene, unlawful, unsafe, infringing or privacy-invasive content.
                </SubSection>
                <SubSection id="15.4">
                  The Agency must promptly correct or withdraw inaccurate information and notify us of complaints, disputes, privacy concerns or restrictions.
                </SubSection>
                <SubSection id="15.5">
                  The Agency must cooperate promptly with VBYM in responding to authority challenges, privacy complaints, takedown requests, regulator enquiries and third-party claims relating to Agency Content or a Property instruction.
                </SubSection>
              </div>

              <Divider />

              {/* 16 */}
              <div id="ip-media-rights">
                <SectionTitle>16. Intellectual property and media rights</SectionTitle>
                <SubSection id="16.1">
                  VBYM owns or licenses the Platform, software, workflows, templates, player, branding, processing methods and VBYM-created materials.
                </SubSection>
                <SubSection id="16.2">
                  VBYM retains legal ownership of VBYM-created media, including Standard Media-Pack Assets, the immersive experience and Raw Materials, subject to third-party rights.
                </SubSection>
                <SubSection id="16.3">
                  After full payment, the Agency receives a perpetual, worldwide, royalty-free, non-exclusive licence to use and distribute Standard Media-Pack Assets for lawful Property and Agency marketing.
                </SubSection>
                <SubSection id="16.4">
                  The Full Immersive 360-degree Experience remains hosted and controlled by VBYM and may be displayed only through approved links, embeds or Platform methods while available.
                </SubSection>
                <SubSection id="16.5">
                  Raw Materials and project files are not included unless expressly agreed.
                </SubSection>
              </div>

              <Divider />

              {/* 17 */}
              <div id="agency-content">
                <SectionTitle>17. Agency Content and optional marketing use</SectionTitle>
                <SubSection id="17.1">
                  The Agency retains ownership of Agency Content and grants VBYM a licence to process and display it as necessary to provide, secure and evidence the Services.
                </SubSection>
                <SubSection id="17.2">
                  Named case studies, Agency logos, testimonials and identifiable Property marketing by VBYM require the applicable opt-in and Property authority.
                </SubSection>
                <SubSection id="17.3">
                  Refusal of optional publicity does not affect ordinary service or price.
                </SubSection>
              </div>

              <Divider />

              {/* 18 */}
              <div id="data-protection-roles">
                <SectionTitle>18. Data protection roles</SectionTitle>
                <SubSection id="18.1">
                  Each party will comply with applicable data-protection law.
                </SubSection>
                <SubSection id="18.2">
                  Where VBYM processes Personal Data only on Agency instructions, the Agency is controller and VBYM is processor. Where VBYM determines its own purposes for Platform operation, security, billing, compliance or marketing, VBYM acts as controller.
                </SubSection>
                <SubSection id="18.3">
                  The parties will enter into any required processor terms. The Agency must provide lawful instructions and required privacy information.
                </SubSection>
                <SubSection id="18.4">
                  The Agency gives VBYM general written authorisation to use approved hosting, database, authentication, payment, communications, electronic-signature, booking, security and other processors or subprocessors required to provide the Services, subject to this section and Schedule 2. VBYM will maintain a current private provider register, impose applicable Article 28 terms and use any required international-transfer safeguard. Internal VBYM personnel are not subprocessors merely because they develop, operate or administer the Platform on VBYM&rsquo;s behalf.
                </SubSection>
                <SubSection id="18.5">
                  Each party must maintain records sufficient to demonstrate its own compliance and must provide reasonable assistance with individual-rights requests, data-protection complaints, DPIAs, regulator enquiries and breach assessment.
                </SubSection>
                <SubSection id="18.6">
                  Where the Agency supplies Personal Data about vendors, occupiers or other individuals, it must ensure they receive the required privacy information no later than the time required by applicable law.
                </SubSection>
              </div>

              <Divider />

              {/* 19 */}
              <div id="security-incidents">
                <SectionTitle>19. Security and incidents</SectionTitle>
                <SubSection id="19.1">
                  Each party must use appropriate security, including named accounts, role-based access, MFA where available, secure devices and prompt offboarding.
                </SubSection>
                <SubSection id="19.2">
                  The Agency must not upload plaintext passwords, full card data, identity documents, health data, alarm codes or unrelated Personal Data except through an approved secure process.
                </SubSection>
                <SubSection id="19.3">
                  Suspected compromise, unauthorised access or a Personal Data Breach must be reported promptly.
                </SubSection>
                <SubSection id="19.4">
                  VBYM may suspend access immediately to protect data, property security, users or legal compliance.
                </SubSection>
              </div>

              <Divider />

              {/* 20 */}
              <div id="confidentiality">
                <SectionTitle>20. Confidentiality</SectionTitle>
                <SubSection id="20.1">
                  Each party must protect confidential information and use it only for the contract.
                </SubSection>
                <SubSection id="20.2">
                  Confidentiality does not apply to information lawfully public, independently developed, already known without restriction or lawfully received from a third party.
                </SubSection>
                <SubSection id="20.3">
                  Required legal disclosure is permitted where the receiving party gives notice where lawful and discloses only what is required.
                </SubSection>
              </div>

              <Divider />

              {/* 21 */}
              <div id="warranties">
                <SectionTitle>21. Warranties and disclaimers</SectionTitle>
                <SubSection id="21.1">
                  We will provide Services with reasonable care and skill.
                </SubSection>
                <SubSection id="21.2">
                  We do not guarantee traffic, leads, instructions, sale, letting, ranking, continuous Platform availability or compatibility with every third-party service.
                </SubSection>
                <SubSection id="21.3">
                  Floor plans and dimensions are approximate marketing materials, not surveys or architectural drawings.
                </SubSection>
              </div>

              <Divider />

              {/* 22 */}
              <div id="liability">
                <SectionTitle>22. Liability</SectionTitle>
                <SubSection id="22.1">
                  Nothing in the contract excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, deliberate misconduct, or any liability that cannot lawfully be excluded or limited.
                </SubSection>
                <SubSection id="22.2">
                  Subject to section 22.1, neither party is liable for indirect or consequential loss or for loss of profit, revenue, goodwill or anticipated savings, except where such loss forms part of a third-party claim covered by an express indemnity.
                </SubSection>
                <SubSection id="22.3">
                  Subject to sections 22.1, 22.4 and 22.5, VBYM&rsquo;s aggregate liability arising out of or in connection with an Order or a series of related Orders is limited to the higher of GBP 5,000 and 125 percent of the fees paid or payable under the affected Order or related Orders during the 12 months immediately preceding the event giving rise to the claim.
                </SubSection>
                <SubSection id="22.4">
                  VBYM&rsquo;s aggregate liability for breach of confidentiality, breach of data-protection obligations or infringement by VBYM-created final media of a third party&rsquo;s intellectual-property rights is limited to the higher of GBP 25,000 and 200 percent of the fees paid or payable under the affected Order or related Orders during the 12 months immediately preceding the event giving rise to the claim.
                </SubSection>
                <SubSection id="22.5">
                  The financial caps do not apply to unpaid fees, the Agency indemnity in section 8.8, the Agency&rsquo;s unlawful or unauthorised use of content, or either party&rsquo;s deliberate misuse of the other party&rsquo;s intellectual property or confidential information.
                </SubSection>
                <SubSection id="22.6">
                  Each party must take reasonable steps to mitigate loss and may not recover more than once for the same loss.
                </SubSection>
                <SubSection id="22.7">
                  VBYM is not liable for a failure or delay caused by an Agency system, an Agency-selected third-party provider or inaccurate Agency instructions, except to the extent VBYM failed to use reasonable care and skill in managing a dependency expressly included in the Order.
                </SubSection>
                <SubSection id="22.8">
                  The Order Form may state negotiated alternative caps, which apply only to the identified Agency and Services.
                </SubSection>
              </div>

              <Divider />

              {/* 23 */}
              <div id="insurance">
                <SectionTitle>23. Insurance, safety and force majeure</SectionTitle>
                <SubSection id="23.1">
                  Each party will maintain insurance reasonably appropriate to its role, risks and contractual liabilities. Any minimum cover required for a particular Agency or Service must be stated in the Order Form.
                </SubSection>
                <SubSection id="23.2">
                  Neither party is liable for delay caused by events outside reasonable control, provided it takes reasonable steps to reduce impact.
                </SubSection>
                <SubSection id="23.3">
                  Safety concerns may require cancellation or suspension without liability for unperformed unsafe work.
                </SubSection>
              </div>

              <Divider />

              {/* 24 */}
              <div id="hosting">
                <SectionTitle>24. Hosting, withdrawal and retention</SectionTitle>
                <SubSection id="24.1">
                  Hosting periods, archive treatment and optional renewal are stated in the Order Form. Each Founder Pilot PAYG or Subscription media pack includes immersive hosting for 12 months from first publication, ending earlier if the Property is sold, let, withdrawn or removed at the Agency&rsquo;s request.
                </SubSection>
                <SubSection id="24.2">
                  VBYM will normally send the Agency a renewal notice approximately 30 days before an included Founder Pilot hosting period expires. Renewal is optional and is not automatic.
                </SubSection>
                <SubSection id="24.3">
                  If the Agency accepts the renewal offer and pays the applicable fee, immersive hosting continues for a further 12 months. The Founder Pilot renewal price is GBP 30 plus VAT per Property unless otherwise agreed in writing.
                </SubSection>
                <SubSection id="24.4">
                  If hosting is not renewed, or following a valid withdrawal, sold or let notification, VBYM may unpublish the public immersive content and retain it in a restricted non-public archive for up to 90 days before deletion, unless a legal, security, dispute or documented retention reason requires longer.
                </SubSection>
                <SubSection id="24.5">
                  Raw Materials are normally retained for 90 days after final approval or delivery unless another period or legal hold applies.
                </SubSection>
                <SubSection id="24.6">
                  Standard-asset download access need not be indefinite, but the fully paid licence remains perpetual.
                </SubSection>
              </div>

              <Divider />

              {/* 25 */}
              <div id="suspension-termination">
                <SectionTitle>25. Suspension and termination</SectionTitle>
                <SubSection id="25.1">
                  Either party may terminate for material breach not remedied within 14 days after written notice, or immediately for serious fraud, insolvency, safety, privacy or security risk.
                </SubSection>
                <SubSection id="25.2">
                  VBYM may suspend access or work while payment is overdue or where necessary to protect the Platform or users.
                </SubSection>
                <SubSection id="25.3">
                  On termination, accrued rights, payment obligations, confidentiality, intellectual-property rights, data protection and liability provisions survive as appropriate.
                </SubSection>
              </div>

              <Divider />

              {/* 26 */}
              <div id="notices">
                <SectionTitle>26. Notices, assignment and subcontracting</SectionTitle>
                <SubSection id="26.1">
                  Formal notices must be sent to the addresses or emails stated in the Order Form.
                </SubSection>
                <SubSection id="26.2">
                  The Agency may not assign the contract without consent. VBYM may assign to a group company or business purchaser on notice.
                </SubSection>
                <SubSection id="26.3">
                  VBYM may use approved infrastructure, payment, communications, operational, software-development and technical-support suppliers but remains responsible for performance under the contract. VBYM retains control of the principal Platform accounts and supplier access. Any supplier that processes Personal Data or accesses it from another country must be appointed under appropriate written terms and any required international-transfer safeguard.
                </SubSection>
              </div>

              <Divider />

              {/* 27 */}
              <div id="general">
                <SectionTitle>27. General</SectionTitle>
                <SubSection id="27.1">
                  No failure to enforce a right is a waiver.
                </SubSection>
                <SubSection id="27.2">
                  If a provision is invalid, it is adjusted or removed to the minimum extent necessary and the remainder continues.
                </SubSection>
                <SubSection id="27.3">
                  The contract contains the entire agreement about its subject matter, excluding fraud.
                </SubSection>
                <SubSection id="27.4">
                  No third party has rights under the Contracts (Rights of Third Parties) Act 1999 unless expressly stated.
                </SubSection>
              </div>

              <Divider />

              {/* 28 */}
              <div id="governing-law">
                <SectionTitle>28. Governing law, jurisdiction and contact</SectionTitle>
                <SubSection id="28.1">
                  The contract and non-contractual disputes are governed by the law of England and Wales.
                </SubSection>
                <SubSection id="28.2">
                  The courts of England and Wales have exclusive jurisdiction.
                </SubSection>
                <SubSection id="28.3">
                  Commercial and support enquiries: support@viewbeforeyoumove.com. Privacy enquiries: privacy@vbym.co.uk.
                </SubSection>
                <SubSection id="28.4">
                  Postal address: View Before You Move Ltd, 10A King Street, Luton, England, LU1 2DP.
                </SubSection>
              </div>

              <Divider />

              {/* Schedule 1 */}
              <div id="schedule-1">
                <SectionTitle>Schedule 1 — Minimum Order Form information</SectionTitle>
                <Ul
                  items={[
                    "Agency identity, authorised signatory and contacts.",
                    "Selected Services, prices, VAT, payment dates and Founder Pilot status.",
                    "Pilot or Subscription term, renewal, cancellation notice, credits and rollover.",
                    "Property bands, service area, travel, appointment windows and surcharges.",
                    "Cancellation, failed-access and revisit charges.",
                    "Included outputs, amendment rounds and turnaround target.",
                    "CRM/feed route, direct write-back status and export fallback.",
                    "Hosting, archive and Raw Materials retention.",
                    "Optional case-study permissions.",
                    "Data-protection roles, current processor categories, production-administration controls and any international-transfer schedules applicable to an active service provider.",
                    "Default and any negotiated liability caps.",
                    "Minimum insurance requirements, if any.",
                    "Service-complaint and data-protection complaint contacts.",
                    "Version/date of accepted Terms and method of acceptance.",
                  ]}
                />
              </div>

              <Divider />

              {/* Schedule 2 */}
              <div id="schedule-2">
                <SectionTitle>Schedule 2 — General Processor and Subprocessor Authorisation</SectionTitle>
                <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
                  The Agency gives general written authorisation for VBYM to appoint and use approved service providers and subprocessors where reasonably necessary to provide, operate, secure and support the VBYM Platform and Services.
                </p>
                <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
                  These providers may include hosting, database, authentication, storage, payment, communications, electronic-signature, booking, monitoring, security, backup, software-development and technical-support providers.
                </p>
                <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
                  VBYM remains responsible for ensuring that any subprocessor processing Personal Data on VBYM&rsquo;s behalf is subject to appropriate written contractual, confidentiality, security and data-protection obligations.
                </p>
                <p className="mb-4 text-[14px] leading-relaxed text-gray-600">
                  Where required by applicable Data Protection Law, VBYM will give the Agency reasonable notice of an intended material addition or replacement of a subprocessor so that the Agency has a reasonable opportunity to object on legitimate data-protection grounds.
                </p>

                <h3 className="mb-2 text-[14.5px] font-bold text-gray-800">Approved Subprocessor</h3>
                <Table
                  headers={["Subprocessor", "Location", "Approved Services", "Safeguards"]}
                  rows={[
                    [
                      "Cyber Nexus (SMC-Private) Limited",
                      "Pakistan",
                      "Software development, maintenance and approved technical support for the VBYM Platform.",
                      "Subject to written confidentiality and data-processing obligations, restricted and role-based access controls, and applicable UK international-transfer safeguards.",
                    ],
                  ]}
                />

                <p className="mb-2 mt-4 text-[14px] leading-relaxed text-gray-600">
                  VBYM may also use approved infrastructure and operational providers for services such as hosting, database services, authentication, storage, payments, communications, electronic signatures, booking, monitoring, security, backups and customer support.
                </p>
                <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
                  Such providers will be subject to VBYM&rsquo;s supplier due-diligence process and appropriate contractual and security requirements. Where a provider involves an international transfer of Personal Data, VBYM will put in place the applicable international-transfer safeguards required by Data Protection Law.
                </p>
                <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
                  VBYM maintains a current record of its material service providers and subprocessors. Information about relevant subprocessors may be provided to the Agency on reasonable request.
                </p>
                <p className="text-[14px] leading-relaxed text-gray-600">
                  VBYM will remain responsible to the Agency for the performance of its obligations under the applicable Data Processing Schedule notwithstanding the appointment of any approved subprocessor.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
