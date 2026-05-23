const navSections = [
  { id: "about", title: "1. About Us and These Terms" },
  { id: "services", title: "2. Our Services" },
  { id: "eligibility", title: "3. Eligibility and Accounts" },
  { id: "fees", title: "4. Subscription Plans, Fees and Payments" },
  { id: "acceptable-use", title: "5. Acceptable Use" },
  { id: "ip", title: "6. Intellectual Property and VR Content" },
  { id: "listings", title: "7. Property Information and Listings" },
  { id: "ecommerce", title: "8. E-Commerce, Hardware and Optional Services" },
  { id: "disclaimers", title: "9. Disclaimers" },
  { id: "liability", title: "10. Limitation of Liability" },
  { id: "termination", title: "11. Suspension and Termination" },
  { id: "privacy", title: "12. Privacy and Cookies" },
  { id: "confidentiality", title: "13. Confidentiality" },
  { id: "third-party", title: "14. Third-Party Links and Services" },
  { id: "governing-law", title: "15. Governing Law and Jurisdiction" },
  { id: "contact", title: "16. Contact Us" },
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

function SubUl({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-1.5 ml-4 space-y-1 list-[circle] marker:text-gray-300">
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
        <div className="mx-auto max-w-[1800px] px-5">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.1em] text-blue-700">
            Legal
          </p>
          <h1 className="mb-2 text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Terms and conditions
          </h1>
          <p className="text-[14px] text-gray-500">Last updated: [to be confirmed]</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1800px] px-5">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">

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
            <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-0">

              {/* 1 */}
              <div id="about">
                <SectionTitle>1. About Us and These Terms</SectionTitle>
                <SubSection id="1.1">
                  These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the View Before You Move website at viewbeforeyoumove.com (the &ldquo;Website&rdquo;), our mobile applications (the &ldquo;Apps&rdquo;), and all services provided through them (together, the &ldquo;Platform&rdquo;).
                </SubSection>
                <SubSection id="1.2">
                  The Platform is operated by: <strong>View Before You Move Ltd</strong>, Company number: [●], Registered office: [●] (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
                </SubSection>
                <SubSection id="1.3">
                  By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.
                </SubSection>
                <SubSection id="1.4">
                  These Terms apply to:
                </SubSection>
                <Ul items={[
                  "Estate and letting agents, commercial agents and other professional users (\u201cAgents\u201d);",
                  "Property seekers / buyers / tenants / users (\u201cBuyers\u201d); and",
                  "Any other visitors or users of the Platform.",
                ]} />
                <SubSection id="1.5">
                  We may update these Terms from time to time. The latest version will always be available on the Website and/or in the Apps and will state the &ldquo;Last updated&rdquo; date. Your continued use of the Platform after changes are made constitutes your acceptance of the updated Terms.
                </SubSection>
                <SubSection id="1.6">
                  If you are an Agent and have also entered into a separate written agreement with us (for example, a Founding Partner Agreement, Master Services Agreement or Statement of Work), that agreement will apply in addition to these Terms. If there is any conflict, the written agreement will take precedence for the specific services covered by it.
                </SubSection>
              </div>

              <Divider />

              {/* 2 */}
              <div id="services">
                <SectionTitle>2. Our Services</SectionTitle>
                <SubSection id="2.1">
                  The Platform provides, among other things:
                </SubSection>
                <Ul items={[
                  <>A property portal with an initial focus on the UK, supporting:
                    <SubUl items={["Residential sales", "Residential rentals / lettings", "Commercial sales", "Commercial lettings"]} />
                  </>,
                  <>Listings that may include immersive VR experiences, enabling Buyers to:
                    <SubUl items={[
                      "Watch a guided Full VR Tour (where available) of a property;",
                      "Pause during the tour; and",
                      "Look around in full 360° at that point in the property.",
                    ]} />
                  </>,
                  <>Tools for Agents to:
                    <SubUl items={[
                      "Create and manage property listings;",
                      "Upload source media (including 360°/VR footage) for processing;",
                      "Access analytics and lead information; and",
                      "Manage billing and account details.",
                    ]} />
                  </>,
                  <>Tools for Buyers to:
                    <SubUl items={[
                      "Search and filter properties;",
                      "View property details and (where available) Full VR Tours or teaser clips;",
                      "Save favourites and searches; and",
                      "Send enquiries to Agents.",
                    ]} />
                  </>,
                  "Optional hardware store / rental functionality (for example, cameras, tripods and compatible VR headsets).",
                  <>Optional &ldquo;We film it&rdquo; or similar capture services, where we or our partners arrange VR filming on behalf of Agents, subject to separate terms.</>,
                ]} />
                <SubSection id="2.2">
                  We may in future extend the Platform to support properties in other countries (for example, the USA, Spain or other markets). While the initial launch is UK-focused, the architecture is designed to support multi-country rules and we may add such functionality over time.
                </SubSection>
                <SubSection id="2.3">
                  We are not an estate agency. We do not:
                </SubSection>
                <Ul items={[
                  "Act as an agent for Buyers, Sellers, landlords or tenants;",
                  "Arrange or conduct valuations, surveys, viewings or negotiations;",
                  "Provide financial, mortgage, tax, legal or other regulated advice; or",
                  "Guarantee that any property is suitable for your needs.",
                ]} />
                <SubSection id="2.4">
                  All property details, availability information and pricing are provided by Agents or other third parties, not by us (see Section 7).
                </SubSection>
              </div>

              <Divider />

              {/* 3 */}
              <div id="eligibility">
                <SectionTitle>3. Eligibility and Accounts</SectionTitle>
                <p className="mb-2 text-[14px] font-semibold text-gray-800">3.1 Buyers / General Users</p>
                <SubSection id="3.1.1">
                  You may use some features of the Platform as a guest. Certain features (for example, creating favourites, saving searches, using the Apps) may require you to create an account.
                </SubSection>
                <SubSection id="3.1.2">
                  To create an account as a Buyer or general user, you must:
                </SubSection>
                <Ul items={["Be at least 18 years old; and", "Provide accurate, current information when creating your account."]} />
                <SubSection id="3.1.3">
                  You are responsible for keeping your login details confidential and for all activity under your account.
                </SubSection>
                <SubSection id="3.1.4">
                  You must notify us promptly if you suspect that anyone has gained unauthorised access to your account.
                </SubSection>
                <p className="mb-2 mt-4 text-[14px] font-semibold text-gray-800">3.2 Agents</p>
                <SubSection id="3.2.1">
                  To list properties or use the Agent tools on the Platform, you must:
                </SubSection>
                <Ul items={[
                  "Be an estate or letting agency, commercial property agent, or other professional authorised to market properties; and",
                  "Ensure that all information you provide is accurate, not misleading, and compliant with applicable law and industry regulations.",
                ]} />
                <SubSection id="3.2.2">
                  We may request information and documentation to verify your identity, your agency and your authority to act. This may include KYC / AML checks and confirmations of regulatory status where relevant.
                </SubSection>
                <SubSection id="3.2.3">
                  We may refuse, suspend or terminate access to Agent functionality if:
                </SubSection>
                <Ul items={[
                  "We are unable to verify your identity or agency;",
                  "We reasonably suspect misuse, fraud or non-compliance; or",
                  "You are in breach of these Terms or any other agreement with us.",
                ]} />
              </div>

              <Divider />

              {/* 4 */}
              <div id="fees">
                <SectionTitle>4. Subscription Plans, Fees and Payments (Agents)</SectionTitle>
                <SubSection id="4.1">
                  Some features are available only on a paid subscription or per-tour / per-service basis.
                </SubSection>
                <SubSection id="4.2">
                  The applicable fees, subscription plans and payment terms will be set out on our Website or within the Agent portal and/or in a separate written agreement between you and us.
                </SubSection>
                <SubSection id="4.3">
                  By signing up to a subscription, ordering VR processing, ordering optional capture services, or purchasing or renting hardware through the Platform, you agree to pay the applicable fees and charges.
                </SubSection>
                <SubSection id="4.4">
                  Unless otherwise stated:
                </SubSection>
                <Ul items={[
                  "Subscription fees are payable in advance for each billing period;",
                  "Per-tour or one-off service fees are billed at the time of order or on completion of the relevant service; and",
                  "All fees are exclusive of VAT or other sales taxes, which will be added where applicable.",
                ]} />
                <SubSection id="4.5">
                  Payments are processed via third-party payment providers (such as Stripe and/or PayPal). By using those services, you agree to their terms and conditions as well as ours.
                </SubSection>
                <SubSection id="4.6">
                  We may suspend or terminate your access to the Platform or to certain Agent features if any amounts are overdue or payments are declined.
                </SubSection>
                <SubSection id="4.7">
                  We may update our pricing from time to time. Changes to subscription fees will not affect the current billing period and will be notified in advance where required by law or by your specific plan terms.
                </SubSection>
              </div>

              <Divider />

              {/* 5 */}
              <div id="acceptable-use">
                <SectionTitle>5. Acceptable Use of the Platform</SectionTitle>
                <SubSection id="5.1">
                  You may only use the Platform for lawful purposes and in accordance with these Terms.
                </SubSection>
                <SubSection id="5.2">
                  You must not:
                </SubSection>
                <Ul items={[
                  "Use the Platform in any way that breaches any applicable local, national or international law or regulation;",
                  "Use the Platform to transmit, upload or publish any material that is defamatory, obscene, offensive, hateful, discriminatory or otherwise objectionable;",
                  "Infringe the intellectual property rights or privacy rights of any person;",
                  "Attempt to gain unauthorised access to any part of the Platform, server, database or system;",
                  "Introduce viruses, trojans, worms, logic bombs or other malicious or technologically harmful material;",
                  "Copy, scrape, \"harvest\" or systematically extract data from the Platform other than as permitted by normal user interaction or any express written permission from us;",
                  "Interfere with, or disrupt, the operation of the Platform or any user's enjoyment of it.",
                ]} />
                <SubSection id="5.3">
                  We may suspend or terminate your access to the Platform at any time if we reasonably believe you have breached these Terms or any other applicable agreement with us.
                </SubSection>
              </div>

              <Divider />

              {/* 6 */}
              <div id="ip">
                <SectionTitle>6. Intellectual Property and VR Content</SectionTitle>
                <p className="mb-2 text-[14px] font-semibold text-gray-800">6.1 Our IP</p>
                <SubSection id="6.1.1">
                  The Platform and all content on it (including software, logos, branding, designs, text, graphics, layout and user interfaces) are owned by us or our licensors and are protected by copyright, trade mark and other intellectual property rights.
                </SubSection>
                <SubSection id="6.1.2">
                  You may use the Platform for your personal use (if you are a Buyer) or internal business use (if you are an Agent) only. You must not:
                </SubSection>
                <Ul items={[
                  "Copy, modify or create derivative works except as expressly permitted;",
                  "Decompile, reverse engineer or disassemble any part of the Platform (except where expressly permitted by law);",
                  "Remove, obscure or alter any copyright, trade mark or proprietary notices.",
                ]} />
                <p className="mb-2 mt-4 text-[14px] font-semibold text-gray-800">6.2 VR Content and Controlled Distribution</p>
                <SubSection id="6.2.1">
                  All immersive VR tours, moving 360° videos, stills, audio, edits, teaser clips and related materials created, processed or made available through the Platform (together, &ldquo;VR Content&rdquo;) are and shall remain the exclusive property of View Before You Move Ltd or its licensors.
                </SubSection>
                <SubSection id="6.2.2">
                  For clarity: a &ldquo;Full VR Tour&rdquo; is the complete immersive VR experience of a property as processed and presented on the Platform. A &ldquo;Teaser Clip&rdquo; is a shorter, selected or edited extract of a Full VR Tour, created or approved by us for external marketing use.
                </SubSection>
                <SubSection id="6.2.3">
                  Subject to your ongoing compliance with these Terms and payment of all applicable fees, we grant Agents a limited, non-exclusive, non-transferable, revocable licence to display Full VR Tours via the Platform&apos;s Website and Apps, and in-branch using in-office screens and/or smart-glasses / VR headsets in accordance with our &ldquo;Office Smart-Glasses Mode&rdquo; rules.
                </SubSection>
                <SubSection id="6.2.4">
                  Except as expressly permitted, you must not:
                </SubSection>
                <Ul items={[
                  "Download, rip or otherwise extract Full VR Tours or VR Content from the Platform;",
                  <>Upload, host or display Full VR Tours on:
                    <SubUl items={[
                      "your own website,",
                      "any third-party property portal (e.g. Rightmove, Zoopla or similar), or",
                      "any other third-party platform or service;",
                    ]} />
                  </>,
                  "Post, upload or stream Full VR Tours on your social media channels;",
                  "Sublicense, sell, rent, license or otherwise commercially exploit VR Content outside the uses expressly permitted by us;",
                  "Create derivative works from Full VR Tours (other than Teaser Clips we have provided for that purpose).",
                ]} />
                <SubSection id="6.2.5">
                  Where we provide Teaser Clips or other approved extracts for marketing, you may use those on your own website and your agency social channels for as long as your account is in good standing and any applicable fees are paid. You must not edit or alter Teaser Clips in a way that is misleading, offensive or inconsistent with our brand guidelines.
                </SubSection>
                <SubSection id="6.2.6">
                  We reserve the right to withdraw or suspend your licence to use VR Content or Teaser Clips if you breach these Terms or any separate agreement with us.
                </SubSection>
                <p className="mb-2 mt-4 text-[14px] font-semibold text-gray-800">6.3 Agent Content and Licence to Us</p>
                <SubSection id="6.3.1">
                  Agents may provide us with property details, images, descriptions, floor plans, logos and other content (&ldquo;Agent Content&rdquo;).
                </SubSection>
                <SubSection id="6.3.2">
                  By submitting Agent Content, you confirm that you own, or have all rights, licences and permissions needed to upload and use the Agent Content; and you grant us a worldwide, non-exclusive, royalty-free licence (with the right to sub-license) to use, reproduce, modify, adapt, publish, translate, distribute and display the Agent Content on the Platform and in our own marketing, for as long as the relevant listing is on the Platform and for a reasonable period afterwards.
                </SubSection>
                <SubSection id="6.3.3">
                  You are responsible for ensuring that Agent Content is accurate, up-to-date and compliant with applicable law.
                </SubSection>
                <p className="mb-2 mt-4 text-[14px] font-semibold text-gray-800">6.4 User Content (Buyers and Other Users)</p>
                <SubSection id="6.4.1">
                  If you submit any content (for example, reviews, ratings, comments or feedback), you grant us a non-exclusive, worldwide, royalty-free licence to use, reproduce, modify, adapt, publish and display that content in connection with the Platform.
                </SubSection>
                <SubSection id="6.4.2">
                  We may remove any Agent Content or user content that we reasonably believe breaches these Terms or is otherwise inappropriate.
                </SubSection>
              </div>

              <Divider />

              {/* 7 */}
              <div id="listings">
                <SectionTitle>7. Property Information and Listings</SectionTitle>
                <SubSection id="7.1">
                  Property listings on the Platform are supplied by Agents and other third parties, not by us.
                </SubSection>
                <SubSection id="7.2">
                  We do not:
                </SubSection>
                <Ul items={[
                  "Independently verify property details, availability, prices, measurements, legal title or ownership;",
                  "Guarantee the accuracy, completeness or currency of property information or VR Content;",
                  "Endorse any specific property, Agent or third party.",
                ]} />
                <SubSection id="7.3">
                  Buyers must carry out their own checks and due diligence (including inspections, surveys and legal advice) before making any decision to view, rent, purchase or otherwise deal with any property.
                </SubSection>
                <SubSection id="7.4">
                  We will use reasonable efforts to encourage Agents to keep their listings up to date, but we do not guarantee that status or availability information is accurate at all times.
                </SubSection>
                <SubSection id="7.5">
                  Where we provide calculators or tools (for example, mortgage calculators, stamp duty estimators or affordability tools), these are illustrative only and are not financial advice and must not be relied upon as such.
                </SubSection>
              </div>

              <Divider />

              {/* 8 */}
              <div id="ecommerce">
                <SectionTitle>8. E-Commerce, Hardware and Optional Services</SectionTitle>
                <SubSection id="8.1">
                  We may offer Agents the ability to purchase or rent cameras, accessories, VR headsets or other hardware (&ldquo;Hardware&rdquo;) via or in connection with the Platform.
                </SubSection>
                <SubSection id="8.2">
                  Unless we expressly state otherwise, we are not the manufacturer of the Hardware. Any manufacturer warranties will apply as between you and the manufacturer. Our role is limited to facilitating the sale or rental and providing customer support as described in your order terms.
                </SubSection>
                <SubSection id="8.3">
                  Additional terms may apply to Hardware purchases or rentals, including delivery, risk and title passing; responsibility for loss, theft or damage; and return conditions and restocking fees where applicable. Those terms will be made available at the point of order.
                </SubSection>
                <SubSection id="8.4">
                  We may also offer optional &ldquo;We film it&rdquo; or similar capture services, where we (or our subcontractors) attend a property to capture footage on your behalf. Such services will be governed by separate written terms or order forms.
                </SubSection>
              </div>

              <Divider />

              {/* 9 */}
              <div id="disclaimers">
                <SectionTitle>9. Disclaimers</SectionTitle>
                <SubSection id="9.1">
                  To the fullest extent permitted by law, the Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not guarantee that the Platform will be uninterrupted or error-free, or that it will meet your specific requirements.
                </SubSection>
                <SubSection id="9.2">
                  We exclude all warranties, representations and conditions, whether express or implied, including without limitation any implied warranties of satisfactory quality, fitness for purpose, non-infringement or compatibility.
                </SubSection>
                <SubSection id="9.3">
                  Without limiting the above, we do not guarantee:
                </SubSection>
                <Ul items={[
                  "That any property on the Platform is suitable for your needs;",
                  "That any Buyer, Agent or third party will act honestly, fulfil their obligations or complete any transaction;",
                  "Any outcome from using our services (for example, number of instructions, leads, viewings or completed deals).",
                ]} />
                <SubSection id="9.4">
                  Nothing in these Terms affects any warranties or rights which cannot be excluded or limited under applicable law.
                </SubSection>
              </div>

              <Divider />

              {/* 10 */}
              <div id="liability">
                <SectionTitle>10. Limitation of Liability</SectionTitle>
                <SubSection id="10.1">
                  Nothing in these Terms excludes or limits our liability for: death or personal injury caused by our negligence; fraud or fraudulent misrepresentation; or any other liability that cannot be excluded or limited by law.
                </SubSection>
                <SubSection id="10.2">
                  To the fullest extent permitted by law, we shall not be liable to you for any loss of profit, revenue, business, contracts, anticipated savings, goodwill or opportunity; or indirect or consequential loss or damage; arising out of or in connection with your use of (or inability to use) the Platform.
                </SubSection>
                <SubSection id="10.3">
                  Subject to Section 10.1, our total aggregate liability to you shall not exceed:
                </SubSection>
                <Ul items={[
                  "For Agents: the total fees actually paid by you to us in the twelve (12) months preceding the event giving rise to the claim;",
                  "For Buyers and other users: £100.",
                ]} />
                <SubSection id="10.4">
                  You agree that these limitations and exclusions are reasonable in light of the nature of the Platform and the fact that we are not party to any property transactions between Agents and Buyers.
                </SubSection>
              </div>

              <Divider />

              {/* 11 */}
              <div id="termination">
                <SectionTitle>11. Suspension and Termination</SectionTitle>
                <SubSection id="11.1">
                  We may suspend or terminate your access to the Platform (or any part of it) at any time if:
                </SubSection>
                <Ul items={[
                  "You breach these Terms or any other applicable agreement with us;",
                  "You fail to pay any fees when due (Agents);",
                  "We reasonably suspect fraudulent or abusive activity; or",
                  "We are required to do so by law or regulation.",
                ]} />
                <SubSection id="11.2">
                  You may stop using the Platform at any time. If you wish to close your account, please contact us at [support email].
                </SubSection>
                <SubSection id="11.3">
                  Suspension or termination does not affect any rights and obligations already accrued, or any provisions of these Terms intended to continue after termination (including Sections 6, 8, 9, 10, 11, 12 and 14).
                </SubSection>
              </div>

              <Divider />

              {/* 12 */}
              <div id="privacy">
                <SectionTitle>12. Privacy and Cookies</SectionTitle>
                <SubSection id="12.1">
                  We will collect and process personal data about you in accordance with our Privacy Policy and applicable data protection laws (including UK GDPR and the Data Protection Act 2018).
                </SubSection>
                <SubSection id="12.2">
                  By using the Platform, you acknowledge that your personal data will be processed as described in our Privacy Policy.
                </SubSection>
                <SubSection id="12.3">
                  The Platform uses cookies and similar technologies. Details are provided in our Privacy Policy and/or a separate Cookie Policy.
                </SubSection>
              </div>

              <Divider />

              {/* 13 */}
              <div id="confidentiality">
                <SectionTitle>13. Confidentiality (Agents / B2B)</SectionTitle>
                <SubSection id="13.1">
                  Where we enter into any separate written agreement with an Agent (such as a Founding Partner Agreement or Statement of Work), the confidentiality terms of that agreement will apply.
                </SubSection>
                <SubSection id="13.2">
                  Any non-public commercial terms agreed between us and an Agent (including special pricing, discounts or launch offers) are strictly confidential and must not be disclosed to third parties, except as required by law or to the Agent&apos;s professional advisers under confidentiality obligations.
                </SubSection>
              </div>

              <Divider />

              {/* 14 */}
              <div id="third-party">
                <SectionTitle>14. Third-Party Links and Services</SectionTitle>
                <SubSection id="14.1">
                  The Platform may contain links to third-party websites or services. Such links are provided for convenience only.
                </SubSection>
                <SubSection id="14.2">
                  We do not endorse or control, and are not responsible for, any third-party content, products or services.
                </SubSection>
                <SubSection id="14.3">
                  Your use of third-party sites or services is at your own risk and subject to their own terms and policies.
                </SubSection>
              </div>

              <Divider />

              {/* 15 */}
              <div id="governing-law">
                <SectionTitle>15. Governing Law and Jurisdiction</SectionTitle>
                <SubSection id="15.1">
                  These Terms, and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims), shall be governed by and construed in accordance with the laws of England and Wales.
                </SubSection>
                <SubSection id="15.2">
                  The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or your use of the Platform.
                </SubSection>
              </div>

              <Divider />

              {/* 16 */}
              <div id="contact">
                <SectionTitle>16. Contact Us</SectionTitle>
                <SubSection id="16.1">
                  If you have any questions about these Terms, please contact us at:
                </SubSection>
                <Ul items={[
                  <>Email: <a href="mailto:support@viewbeforeyoumove.com" className="text-blue-700 hover:underline">support@viewbeforeyoumove.com</a></>,
                  "Postal address: View Before You Move Ltd, [Address]",
                ]} />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
