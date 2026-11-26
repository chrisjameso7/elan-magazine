import InfoPage from '@/components/InfoPage';
import {brand} from '@/lib/brand';
export const metadata={title:'Contact',alternates:{canonical:'/contact'}};
export default function Contact(){return <InfoPage title="Get in touch." eyebrow="The Index"><h2>Editorial enquiries &amp; pitches</h2><p><a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a></p><p>For a pitch, include a concise outline, relevant background and links to your work. For a correction, include the story URL and the information you believe needs attention.</p><h2>Privacy requests</h2><p><a href={`mailto:${brand.privacyEmail}`}>{brand.privacyEmail}</a></p><h2>Publisher</h2><p>{brand.operator}<br/>Chris James — Founder and CEO</p></InfoPage>;}
