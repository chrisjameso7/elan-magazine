import type {ReactNode} from 'react';
export default function InfoPage({title,eyebrow,children}:{title:string;eyebrow:string;children:ReactNode}){return <main id="main-content" className="editorial-body information-page"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></header><div className="information-copy">{children}</div></main>;}
