'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main-content" className="editorial-body archive-page"><h1>We couldn’t load this page.</h1><p>Please try again in a moment.</p><button className="retry-button" onClick={reset}>Try again</button></main>;}
