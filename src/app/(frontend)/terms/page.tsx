import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';

export const metadata: Metadata = {
  title: 'Terms of Service — ÉLAN',
  description: 'Terms governing access to ÉLAN, its editorial content, and administrative systems.',
};

export default function TermsPage() {
  return (
    <PublicationPage title="Terms of Service" eyebrow="ÉLAN / Publication policies" dated>
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using theelanmagazine.com (the &quot;Site&quot;), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Site.</p>
      </section>
      <section>
        <h2>2. Intellectual Property Rights</h2>
        <p>All editorial content, typography, features, original photography, branding, and layout designs published on ÉLAN—including franchises such as <em>The New Guard</em>, <em>The Edit</em>, and <em>ÉLAN Conversations</em>—are the exclusive intellectual property of ÉLAN and its contributing creators.</p>
        <ul>
          <li>You may not copy, reproduce, distribute, or create derivative works from our content without prior written consent.</li>
          <li>Short text quotes and imagery excerpts shared for criticism, review, or media reporting must clearly attribute <strong>ÉLAN</strong> and link directly to the original article URL on theelanmagazine.com.</li>
        </ul>
      </section>
      <section>
        <h2>3. Administrative Access &amp; Security</h2>
        <p>Our publishing systems are reserved for authorized ÉLAN personnel. Attempts to gain unauthorized access, alter records, or introduce malicious code are prohibited. We may restrict access and take appropriate action to protect the publication.</p>
      </section>
      <section>
        <h2>4. Disclaimers</h2>
        <p>The Site and its contents are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. ÉLAN is not liable for temporary service interruptions or network downtime.</p>
      </section>
      <section>
        <h2>5. Contact</h2>
        <p>For syndication or legal inquiries: <a href="mailto:legal@theelanmagazine.com">legal@theelanmagazine.com</a></p>
      </section>
    </PublicationPage>
  );
}
