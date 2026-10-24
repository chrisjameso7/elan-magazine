import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — ÉLAN',
  description: 'How ÉLAN collects, uses, and protects information across its digital publication.',
};

export default function PrivacyPage() {
  return (
    <PublicationPage title="Privacy Policy" eyebrow="ÉLAN / Publication policies" dated updated>
      <section>
        <h2>1. Overview</h2>
        <p>ÉLAN (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy. This Privacy Policy outlines how we collect, use, and protect information when you visit or interact with our digital publication at elanmagazine.com (the &quot;Site&quot;).</p>
      </section>
      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li><strong>Automated Usage Data:</strong> When you access the Site, our hosting infrastructure (Vercel) automatically logs standard network requests, including IP addresses, browser types, referring URLs, and access timestamps for performance and security purposes.</li>
          <li><strong>Voluntary Communications:</strong> If you contact us directly (e.g., editorial inquiries, pitches, or press outreach), we collect your name, email address, and the contents of your message.</li>
          <li><strong>Media &amp; Editorial Assets:</strong> Authorized administrative users who upload imagery or media assets do so via authenticated channels handled by our cloud storage provider.</li>
        </ul>
      </section>
      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the minimal data collected strictly to:</p>
        <ul>
          <li>Render and serve editorial content fast and securely.</li>
          <li>Maintain server uptime, assess site performance, and protect against unauthorized write or system access attempts.</li>
          <li>Respond to editorial, press, or business inquiries.</li>
        </ul>
      </section>
      <section>
        <h2>4. Cookies &amp; Trackers</h2>
        <p>ÉLAN is engineered as a text-first, high-performance publication. We do not sell user data, nor do we run invasive third-party ad network tracking scripts. Essential session storage and cookies are used solely for administrator authentication and core infrastructure operation.</p>
      </section>
      <section>
        <h2>5. Data Storage &amp; Security</h2>
        <p>Persistent publication data is managed via cloud database systems (Supabase) protected by strict access controls and encrypted connections (TLS/SSL). Administrative privileges are restricted strictly to authorized editorial personnel.</p>
      </section>
      <section>
        <h2>6. Third-Party Infrastructure</h2>
        <p>Our architecture relies on trusted third-party providers bound by high security and privacy standards:</p>
        <ul>
          <li><strong>Vercel</strong> (Frontend hosting &amp; edge deployment)</li>
          <li><strong>Supabase</strong> (Database &amp; media storage)</li>
        </ul>
      </section>
      <section>
        <h2>7. Contact Us</h2>
        <p>For any questions regarding this Privacy Policy, please contact:</p>
        <p><strong>Editorial Operations:</strong> <a href="mailto:contact@theelanmagazine.com">contact@theelanmagazine.com</a></p>
      </section>
    </PublicationPage>
  );
}
