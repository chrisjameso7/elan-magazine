import config from '@payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { redirect } from 'next/navigation';
import { importMap } from '../importMap';
type Props = { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> };
export const dynamic = 'force-dynamic';
export const generateMetadata = ({ params, searchParams }: Props) => process.env.DATABASE_URI ? generatePageMetadata({ config, params, searchParams }) : {};
export default function AdminPage(props: Props) {
  if (!process.env.DATABASE_URI) redirect('/editorial-preview');
  return RootPage({ config, importMap, ...props });
}
