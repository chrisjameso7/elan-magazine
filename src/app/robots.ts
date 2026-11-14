import type {MetadataRoute} from 'next';
import {siteURL} from '@/lib/brand';
export default function robots():MetadataRoute.Robots{return process.env.LUMIERE_LAUNCH_READY==='true'?{rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/','/preview/','/design-study','/search']},sitemap:new URL('/sitemap.xml',siteURL()).href}:{rules:{userAgent:'*',disallow:'/'}};}
