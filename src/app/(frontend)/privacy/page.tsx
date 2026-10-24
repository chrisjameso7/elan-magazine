import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — ÉLAN',
  description: 'Our approach to reader privacy, personal information, and staying in touch with ÉLAN.',
};

export default function PrivacyPage() {
  return (
    <PublicationPage title="Privacy Policy" eyebrow="ÉLAN / Publication policies" dated updated>
      <section aria-label="Publication details" className="border-b border-[#751F3D]/25 pb-8">
        <p><strong>Publication:</strong> ÉLAN (theelanmagazine.com)</p>
        <p><strong>Operating Division:</strong> ÉLAN Entertainment</p>
        <p><strong>Parent Entity:</strong> Lumière Media &amp; Entertainment</p>
      </section>
      <section>
        <h2>1. Overview</h2>
        <p>ÉLAN (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is an independent digital publication produced by ÉLAN Entertainment, a division of Lumière Media &amp; Entertainment. ÉLAN Entertainment and its parent company, Lumière Media &amp; Entertainment, are the operating controllers of the Site and its platform data. We respect the privacy of our readers. This policy explains how we handle information when you visit theelanmagazine.com (the &quot;Site&quot;) or get in touch with us.</p>
      </section>
      <section>
        <h2>2. Information We Collect</h2>
        <p>We keep the information we collect to what is needed to run the publication and respond to our readers.</p>
        <ul>
          <li><strong>Technical information:</strong> When you visit, our service providers may record information such as your IP address, browser, operating system, referring page, and the time of your visit. These records help keep the Site secure and working reliably.</li>
          <li><strong>Correspondence:</strong> If you email us with a pitch, press inquiry, or other request, we receive your name, email address, and the information you choose to share.</li>
          <li><strong>Newsletter subscriptions:</strong> If you choose to subscribe to <em>The ÉLAN Briefing</em>, your email address is used to send the publication and manage your subscription.</li>
        </ul>
      </section>
      <section>
        <h2>3. How We Use Information</h2>
        <p>We use this information to:</p>
        <ul>
          <li>Bring you our stories and keep the Site running smoothly.</li>
          <li>Understand technical problems and protect the publication from misuse or unauthorized access.</li>
          <li>Reply to editorial, press, and rights inquiries.</li>
          <li>Send <em>The ÉLAN Briefing</em> to readers who have subscribed.</li>
        </ul>
      </section>
      <section>
        <h2>4. Cookies &amp; Tracking</h2>
        <p>ÉLAN is a place to read, discover, and spend time with ideas. <strong>We do not sell personal information, share it with data brokers, or use invasive cross-site advertising trackers.</strong> Essential cookies and session storage support secure administrator sign-in and the basic operation of the Site.</p>
      </section>
      <section>
        <h2>5. Keeping Information Secure</h2>
        <p>We use encrypted connections and access controls to protect publication content and the information entrusted to us. Access to our publishing systems is limited to authorized ÉLAN personnel.</p>
      </section>
      <section>
        <h2>6. Service Providers</h2>
        <p>Specialist service providers help us host the Site, store publication content, and support reader communications. They process information as needed to deliver those services.</p>
      </section>
      <section>
        <h2>7. Rights &amp; Inquiries</h2>
        <p>Depending on where you live, you may have the right to ask for access to, correction of, or deletion of personal information you have shared with us. You can also contact us to stop receiving <em>The ÉLAN Briefing</em>.</p>
        <p>For privacy questions or data requests, write to <a href="mailto:legal@theelanmagazine.com">legal@theelanmagazine.com</a>.</p>
      </section>
    </PublicationPage>
  );
}
