import InfoPage from "@/components/InfoPage";
import { brand } from "@/lib/brand";
export const metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <InfoPage title="Privacy." eyebrow="Publication information">
      <p>Updated 26 November 2026</p>
      <p>
        {brand.fullName} is operated by {brand.operator}. This page describes the
        information handled by the publication website and private newsroom.
      </p>
      <h2>Website requests</h2>
      <p>
        Hosting and infrastructure providers process technical requests needed
        to serve pages and files. These may include IP addresses, browser
        information, requested URLs and timestamps used for delivery, security
        and diagnostics.
      </p>
      <h2>Newsroom accounts</h2>
      <p>
        The private publishing system stores staff names, email addresses,
        password hashes, session information and editorial activity.
        Authentication cookies support staff sign-in. Access is restricted by
        newsroom roles; staff credentials are not published as contributor
        profiles.
      </p>
      <h2>Newsletter</h2>
      <p>
        If you subscribe, we store your email address with our email provider,
        Resend, and use it only to send The Index newsletter. Every email has
        an unsubscribe link, and you can ask us to delete your address at any
        time.
      </p>
      <h2>Put Us On tips</h2>
      <p>
        If you send a tip, we store the name or handle and link you share, your
        one-line reason, whether it is your own work, and your email address
        if you choose to give it. Editors use tips to decide what to cover. We
        use your email only to credit you or ask a follow-up question, and we
        never publish it. To have a tip deleted, email us at the address below.
      </p>
      <h2>Writer applications</h2>
      <p>
        If you apply to write for us, we store your name, email, optional
        location and social handle, the topics and formats you choose, your
        pitch and any samples you link. Editors use this only to review your
        application and reply. Ask us at the address below to delete it.
      </p>
      <h2>Correspondence and media</h2>
      <p>
        If you email us, we receive the information you choose to send. Uploaded
        editorial media may contain credits, licence records and descriptive
        metadata. Public image credits are separate from private rights notes.
      </p>
      <h2>Cookies, analytics and advertising</h2>
      <p>
        The current application uses essential authentication functionality for
        staff. It does not include a reader account system, advertising scripts,
        marketing pixels or a newsletter signup form. If non-essential analytics
        or advertising is introduced, the disclosures and any required choices
        must be updated before activation.
      </p>
      <h2>Service providers</h2>
      <p>
        The application uses Cloudflare hosting, Supabase database and media
        storage, and Resend for newsroom account-recovery emails. These
        providers process information required to deliver their services.
        Editorial photographs are served from the publication’s media library.
      </p>
      <h2>Requests</h2>
      <p>
        For privacy questions or requests concerning information you have
        shared, email{" "}
        <a href={`mailto:${brand.privacyEmail}`}>{brand.privacyEmail}</a>.
        Describe your request without sending passwords or unnecessary sensitive
        information.
      </p>
    </InfoPage>
  );
}
