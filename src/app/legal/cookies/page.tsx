const navSections = [
  { id: "about", title: "1. About this Policy" },
  { id: "what-are-cookies", title: "2. What cookies and similar technologies are" },
  { id: "how-we-use", title: "3. How VBYM uses these technologies" },
  { id: "strictly-necessary", title: "4. Strictly necessary technologies" },
  { id: "functional-preference", title: "5. Functional and preference technologies" },
  { id: "statistical-analytics", title: "6. Statistical and analytics technologies" },
  { id: "advertising-tracking", title: "7. Advertising and behavioural tracking" },
  { id: "payment-tech", title: "8. Payment technologies" },
  { id: "embedded-media", title: "9. Embedded media, maps and immersive content" },
  { id: "agency-security", title: "10. Agency-account security and separation" },
  { id: "user-choices", title: "11. User choices" },
  { id: "browser-controls", title: "12. Browser and device controls" },
  { id: "duration-retention", title: "13. Duration and retention" },
  { id: "live-register", title: "14. Live cookie register" },
  { id: "third-party-providers", title: "15. Third-party providers" },
  { id: "changes", title: "16. Changes to this Policy" },
  { id: "contact", title: "17. Contacting VBYM" },
  { id: "schedule-1", title: "Schedule 1 — Current launch configuration" },
  { id: "schedule-2", title: "Schedule 2 — Live technology register" },
  { id: "schedule-3", title: "Schedule 3 — Technical verification and change-control procedure" },
];

// Legal clause text still to be added — see matching numbered paragraph
// in 11_VBYM_Cookie_and_Similar_Technologies_Policy_FINAL.pdf.
const PLACEHOLDER = "[ Add text for this clause — see matching numbered paragraph in the PDF ]";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[17px] font-bold text-gray-900">{children}</h2>
  );
}

function SubSection({ id, children }: { id: string; children?: React.ReactNode }) {
  return (
    <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
      <span className="font-semibold text-gray-800">{id}</span>&ensp;
      {children ?? <span className="italic text-gray-400">{PLACEHOLDER}</span>}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 pt-6 mt-6" />;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
                  {cell ? cell : <span className="italic text-gray-400">{PLACEHOLDER}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderedItem({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <p className="mb-2 text-[14px] leading-relaxed text-gray-600">
      <span className="font-semibold text-gray-800">{n}.</span>&ensp;
      {children ?? <span className="italic text-gray-400">{PLACEHOLDER}</span>}
    </p>
  );
}

export default function CookiesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-[#08519A]">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Cookie and Similar Technologies Policy
          </h1>
          <p className="mb-1 text-[14px] text-gray-500">
            For the VBYM website, agency portal and related digital services
          </p>
          <p className="text-[14px] text-gray-500">Effective date: 10 August 2026 | Version 1.2</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-5">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[240px_1fr]">

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

              {/* 1 */}
              <div id="about">
                <SectionTitle>1. About this Policy</SectionTitle>
                <SubSection id="1.1">
                  This Cookie and Similar Technologies Policy explains how View Before You Move Ltd (&ldquo;VBYM&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) uses cookies and similar technologies when a person visits or uses the VBYM website, agency portal, property-listing pages, immersive tours, account pages, booking pages, payment pages or related digital services (together, the &ldquo;Platform&rdquo;).
                </SubSection>
                <SubSection id="1.2">
                  This Policy should be read alongside the VBYM Privacy Notice. The Privacy Notice explains how we collect, use,
share, retain and protect Personal Data and how individuals may exercise their rights.
                </SubSection>
                <SubSection id="1.3">
                  The exact technologies used may change as the Platform develops. VBYM will maintain a current technical register
and update this Policy when a material change affects users or their choices.
                </SubSection>
              </div>

              <Divider />

              {/* 2 */}
              <div id="what-are-cookies">
                <SectionTitle>2. What cookies and similar technologies are</SectionTitle>
                <SubSection id="2.1">
                   Cookies are small text files that a website stores on a computer, mobile telephone, tablet, headset or other
connected device.

                </SubSection>
                <SubSection id="2.2">
                  Similar technologies may include browser local storage, session storage, authentication tokens, software-development kits, tags, scripts, pixels, device identifiers and other technologies that store information on, or access
information from, a user’s device.

                </SubSection>
                <SubSection id="2.3">
                   References to “cookies” in this Policy include similar storage and access technologies unless the context requires
otherwise.

                </SubSection>
              </div>

              <Divider />

              {/* 3 */}
              <div id="how-we-use">
                <SectionTitle>3. How VBYM uses these technologies</SectionTitle>
                <SubSection id="3.1">
                  VBYM may use cookies to operate and secure the Platform, authenticate users, preserve sessions, remember
choices, complete requested bookings or payments, prevent misuse, diagnose faults, maintain availability and improve
the service where permitted by law.
                </SubSection>
                <SubSection id="3.2">
                   Only authorised agency users may upload or manage property-listing content. The Platform must restrict each
agency user to the content, branches and functions connected with that user’s own authorised agency account.
Consumers and general visitors cannot upload property-listing content.


                </SubSection>
                <SubSection id="3.3">
                   Account separation and access restrictions must be enforced by server-side permissions and database or storage
controls. Cookies or browser-side identifiers may support the session, but they must not be the sole control preventing
one agency from accessing another agency’s content.

                </SubSection>
              </div>

              <Divider />

              {/* 4 */}
              <div id="strictly-necessary">
                <SectionTitle>4. Strictly necessary technologies</SectionTitle>
                <SubSection id="4.1">
                  Strictly necessary technologies are required to transmit a communication or to provide a service expressly
requested by the user. Where the legal exception applies, these technologies may be used without consent.


                </SubSection>
                <SubSection id="4.2">
                  They may be used to authenticate agency users, maintain secure sessions, associate a user with the correct
agency and branch, enforce account permissions, protect forms, prevent cross-site request forgery, detect abuse,
balance traffic, preserve a requested checkout or booking, process a requested payment and remember a user’s cookie
preference.


                </SubSection>
                <SubSection id="4.3">
                   Strictly necessary technologies cannot be switched off through the VBYM preference tool. A user may block them
through browser controls, but the agency portal, login, booking, payment or other secure features may then fail to
operate.

                </SubSection>
              </div>

              <Divider />

              {/* 5 */}
              <div id="functional-preference">
                <SectionTitle>5. Functional and preference technologies</SectionTitle>
                <SubSection id="5.1">
                  Functional technologies may remember choices such as language, region, display settings, immersive-tour
preferences, playback settings or other user-selected options.


                </SubSection>
                <SubSection id="5.2">
                   VBYM will use these without consent only where a legal exception applies. Otherwise, they will remain inactive until
the user makes the appropriate choice through the preference tool.

                </SubSection>
                <SubSection id="5.3">
                  Refusing functional technologies may mean that a preference must be selected again during a later visit.

                </SubSection>
              </div>

              <Divider />

              {/* 6 */}
              <div id="statistical-analytics">
                <SectionTitle>6. Statistical and analytics technologies</SectionTitle>
                <SubSection id="6.1">
                  Statistical and analytics technologies may help VBYM understand page use, user journeys, technical errors,
performance, feature use and completion of key processes.

                </SubSection>
                <SubSection id="6.2">
                  At the effective date of this Policy, VBYM does not use optional analytics, advertising tracking, behavioural profiling
or session-recording technologies on the launch configuration.

                </SubSection>
                <SubSection id="6.3">
                  VBYM will not introduce analytics until it has assessed the provider and purpose, updated the live register and
relevant privacy information, and implemented any consent or objection mechanism required by law.

                </SubSection>
                <SubSection id="6.4">
                   Where a statistical technology lawfully falls within an exception, VBYM will meet the conditions of that exception.
Where no exception applies, it will not activate until valid consent has been obtained.


                </SubSection>
              </div>

              <Divider />

              {/* 7 */}
              <div id="advertising-tracking">
                <SectionTitle>7. Advertising and behavioural tracking</SectionTitle>
                <SubSection id="7.1">
                  VBYM does not currently use cookies to build advertising profiles, track users across unrelated services, retarget
previous visitors, sell browsing information or share browsing behaviour with advertising networks.

                </SubSection>
                <SubSection id="7.2">
                   Advertising or behavioural-tracking technologies will not be introduced unless VBYM completes an assessment,
updates this Policy and the Privacy Notice, implements an appropriate consent-management system and obtains valid
consent before activation.

                </SubSection>
              </div>

              <Divider />

              {/* 8 */}
              <div id="payment-tech">
                <SectionTitle>8. Payment technologies</SectionTitle>
                <SubSection id="8.1">
                   Where an agency purchases a media pack, subscription or other service online, the payment provider may use
technologies needed to maintain the requested payment session, authenticate the transaction, prevent fraud and meet
security or regulatory obligations.


                </SubSection>
                <SubSection id="8.2">
                  VBYM does not intend to store complete payment-card details on the Platform. Card information should be entered
directly into the payment provider’s secure environment.

                </SubSection>
                <SubSection id="8.3">
                  The payment provider may process information under its own privacy and cookie documentation.

                </SubSection>
              </div>

              <Divider />

              {/* 9 */}
              <div id="embedded-media">
                <SectionTitle>9. Embedded media, maps and immersive content</SectionTitle>
                <SubSection id="9.1">
 The Platform may display photographs, standard video, 360-degree footage, immersive tours, maps, floor plans or
other interactive content.

                </SubSection>
                <SubSection id="9.2">
                  Where this content is delivered through VBYM-controlled infrastructure, only technologies reasonably required to
provide the requested content should be used.


                </SubSection>
                <SubSection id="9.3">
                   Where an external provider wishes to place a non-essential technology, the optional feature must not load until the
necessary choice has been obtained, unless a legal exception applies. A user may therefore need to enable a category
before certain externally hosted content becomes available.

                </SubSection>
              </div>

              <Divider />

              {/* 10 */}
              <div id="agency-security">
                <SectionTitle>10. Agency-account security and separation</SectionTitle>
                <SubSection id="10.1">
 VBYM may use strictly necessary session and security technologies to identify an authorised agency user,
associate the user with the correct agency and branch, verify permissions, detect suspicious access and end inactive or
compromised sessions.

                </SubSection>
                <SubSection id="10.2">
                   Agency users must not share credentials, permit unauthorised use, attempt to access another agency account,
use another branch’s permissions without authority or interfere with account-separation controls.

                </SubSection>
                <SubSection id="10.3">
 VBYM and its approved software-development supplier must implement tenant isolation using a reliable agency
identifier and server-side authorisation on every relevant API, database query and storage operation. The interface
must never offer an agency user another agency’s record, but interface filtering alone is not sufficient.
                </SubSection>
                <SubSection id="10.4">
                  Important access and administration events should be logged in accordance with VBYM’s production-access and
incident-response procedure. Supplier access must use individual accounts, multi-factor authentication and the
permissions recorded in the VBYM access register.


                </SubSection>
              </div>

              <Divider />

              {/* 11 */}
              <div id="user-choices">
                <SectionTitle>11. User choices</SectionTitle>
                <SubSection id="11.1">
                  If optional technologies are used, the Platform will provide a suitable banner or preference tool allowing users to
accept, reject or select categories and later change or withdraw their choice.

                </SubSection>
                <SubSection id="11.2">
                   Optional technologies must remain inactive until the required choice is recorded. Rejecting optional technologies
must be as easy as accepting them.

                </SubSection>
                <SubSection id="11.3">
                  Strictly necessary technologies remain active where required to operate the requested service securely.

                </SubSection>
                <SubSection id="11.4">
                   A persistent Cookie Settings link should be available in the website footer whenever configurable optional
technologies are present.


                </SubSection>
              </div>

              <Divider />

              {/* 12 */}
              <div id="browser-controls">
                <SectionTitle>12. Browser and device controls</SectionTitle>
                <SubSection id="12.1">
                  Most browsers allow users to view, delete or block cookies and clear local storage. Device or application settings
may provide additional controls.

                </SubSection>
                <SubSection id="12.2">
                   Blocking all cookies may prevent a user from signing in, remaining signed in, accessing the agency portal,
managing agency listings, completing a booking or payment, or using immersive features.


                </SubSection>
                <SubSection id="12.3">
                  Browser controls may not manage every similar technology. Users should review the privacy and storage settings
of their browser, device and relevant applications.

                </SubSection>
              </div>

              <Divider />

              {/* 13 */}
              <div id="duration-retention">
                <SectionTitle>13. Duration and retention</SectionTitle>
                <SubSection id="13.1">
                   A session technology normally expires when the browser or secure session ends. A persistent technology remains
for a defined period or until deleted.


                </SubSection>
                <SubSection id="13.2">
                  VBYM will not retain a cookie or identifier for longer than reasonably necessary for its stated purpose.


                </SubSection>
                <SubSection id="13.3">
The live cookie register or preference panel should show the expected duration of each material technology.

                </SubSection>
              </div>

              <Divider />

              {/* 14 */}
              <div id="live-register">
                <SectionTitle>14. Live cookie register</SectionTitle>
                <SubSection id="14.1">
                   VBYM will maintain a current register of material cookies and similar technologies used by the live Platform.

                </SubSection>
                <SubSection id="14.2">
                   The register should identify the technology name, provider, first- or third-party status, purpose, category,
information stored or accessed, duration, legal exception or consent requirement and available control.


                </SubSection>
                <SubSection id="14.3">
                  The register must be reviewed whenever VBYM adds a provider, changes authentication, introduces analytics,
embeds third-party media or maps, changes payment services, launches an application or materially changes device
storage or access.

                </SubSection>
              </div>

              <Divider />

              {/* 15 */}
              <div id="third-party-providers">
                <SectionTitle>15. Third-party providers</SectionTitle>
                <SubSection id="15.1">
Providers of hosting, databases, authentication, payments, email, appointment booking, security, monitoring,
media delivery, support and consent management may operate technologies for VBYM.

                </SubSection>
                <SubSection id="15.2">
VBYM will assess relevant providers and enter appropriate contractual arrangements before permitting them to
store or access information through the Platform.

                </SubSection>
                <SubSection id="15.3">
A provider may also process information for its own purposes. Where relevant, users should review that provider’s
privacy and cookie information.

                </SubSection>
              </div>

              <Divider />

              {/* 16 */}
              <div id="changes">
                <SectionTitle>16. Changes to this Policy</SectionTitle>
                <SubSection id="16.1">
 VBYM may update this Policy where the Platform, providers, technologies, law or regulatory guidance changes.
                </SubSection>
                <SubSection id="16.2">
The latest version will be published with its effective date. Where a change materially affects optional technologies
or an earlier choice, VBYM may request a new preference.
                </SubSection>
              </div>

              <Divider />

              {/* 17 */}
              <div id="contact">
                <SectionTitle>17. Contacting VBYM</SectionTitle>
                <SubSection id="17.1">
                  Questions about cookies or similar technologies may be sent to privacy@vbym.co.uk.

                </SubSection>
                <SubSection id="17.2">
Website: www.vbym.co.uk.
                </SubSection>
                <SubSection id="17.3">
 Users may also use the Cookie Settings link where available to review or change their choices.

                </SubSection>
              </div>

              <Divider />

              {/* Schedule 1 — table */}
              <div id="schedule-1">
                <SectionTitle>Schedule 1 — Current launch configuration</SectionTitle>
                <Table
                  headers={["Category", "Current status", "Control"]}
                  rows={[
                    ["Authentication, account and security", "Active where strictly necessary", "Identifiers and durations are maintained in the live technical register; agency and branch permissions are enforced server-side."],
                    ["Cookie-preference storage", "Active only where needed to remember a choice", "A minimal first-party preference record is used only where needed and its lifetime is documented in the live register."],
                    ["Booking and checkout", "Active where needed for a requested transaction", "Only technologies necessary for the requested booking/checkout flow are active; the live register records what is set during the journey."],
                    ["Payment-provider security", "Active when online payments are enabled", "Payment-provider technologies are enabled only with the approved payment flow and are documented in the live register."],
                    ["Functional preferences", "Off unless assessed and configured", "Remain off unless assessed and configured under an applicable exception or valid user choice."],
                    ["Analytics", "Not active", "No analytics script loads unless a later legal, privacy and consent configuration is approved."],
                    ["Session recording", "Not active", "Not active; requires separate assessment and transparent notice before introduction."],
                    ["Advertising and retargeting", "Not active", "Not active; requires prior consent and updated documentation before introduction."],
                    ["Behavioural profiling", "Not active", "Not active; requires a separate legal, privacy and product decision before introduction."],
                  ]}
                />
              </div>

              <Divider />

              {/* Schedule 2 — table */}
              <div id="schedule-2">
                <SectionTitle>Schedule 2 — Live technology register</SectionTitle>
                <Table
                  headers={["Name / key", "Provider and domain", "Purpose", "Category", "Duration", "Consent or exception", "Control"]}
                  rows={[
                    [
                      "Current launch register",
                      "VBYM-controlled live Cookie Settings / technical register",
                      "Exact identifiers, providers, purposes, categories, durations and controls verified against the live configuration",
                      "See live register",
                      "Reviewed on launch and material change",
                      "Consent or applicable exception recorded per technology",
                      "Cookie Settings / browser controls as applicable",
                    ],
                  ]}
                />
              </div>

              <Divider />

              {/* Schedule 3 — numbered procedure */}
              <div id="schedule-3">
                <SectionTitle>Schedule 3 — Technical verification and change-control procedure</SectionTitle>
                <OrderedItem n={1}>
                  The launch scan covered the live public website and agency portal before login, during login, after login and after logout. Repeat this scan after material deployment or provider changes.
                </OrderedItem>
                <OrderedItem n={2}>
                  Test a new visitor who rejects optional technologies and confirm that no optional script or storage is activated.
                </OrderedItem>
                <OrderedItem n={3}>
                  Test an agency user and confirm that the session is restricted to that user&rsquo;s own authorised agency account and branch permissions.
                </OrderedItem>
                <OrderedItem n={4}>
                  Inspect first-party and third-party cookies, local storage, session storage, pixels, tags, SDKs and embedded services.
                </OrderedItem>
                <OrderedItem n={5}>
                  Record exact names, domains, purposes, durations and whether each technology is essential, exempt or consent-dependent.
                </OrderedItem>
                <OrderedItem n={6}>
                  Check Stripe or any replacement payment flow, embedded media, maps, email links, booking tools and support widgets.
                </OrderedItem>
                <OrderedItem n={7}>
                  Update Schedule 2 and the live Cookie Settings panel so they match the production configuration.
                </OrderedItem>
                <OrderedItem n={8}>
                  Retain screenshots or exported scan results with the release record and repeat the scan after material changes.
                </OrderedItem>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
