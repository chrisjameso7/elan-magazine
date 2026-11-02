import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Your subscription — ÉLAN',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const id = typeof params.id === 'string' ? params.id : '';
  const token = typeof params.token === 'string' ? params.token : '';
  return (
    <PublicationPage
      title="Your inbox, your choice."
      eyebrow="The ÉLAN Briefing"
    >
      {params.done === '1' ? (
        <p>
          You’ve unsubscribed from The ÉLAN Briefing. Thank you for spending
          time with us.
        </p>
      ) : id && token && !params.invalid ? (
        <>
          <p>
            To stop receiving The ÉLAN Briefing, confirm below. No sign-in is
            needed.
          </p>
          <form action="/api/newsletter/unsubscribe" method="post">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="token" value={token} />
            <button
              className="bg-[#171717] px-6 py-3 font-sans text-sm text-white hover:bg-[#5e1931]"
              type="submit"
            >
              Unsubscribe
            </button>
          </form>
        </>
      ) : (
        <p>
          This link is incomplete or no longer valid. Please use the unsubscribe
          link in your latest email, or contact{' '}
          <a href="mailto:legal@theelanmagazine.com">
            legal@theelanmagazine.com
          </a>
          .
        </p>
      )}
    </PublicationPage>
  );
}
