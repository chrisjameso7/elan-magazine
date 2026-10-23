import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';
import '@payloadcms/next/css';
const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};
export default function Layout({ children }: { children: React.ReactNode }) {
  if (!process.env.DATABASE_URI) return <html lang="en"><body>{children}</body></html>;
  return RootLayout({ children, config, importMap, serverFunction });
}
