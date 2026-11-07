'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main-content" className="shared-shell"><div className="empty-state"><h1>A moment to regroup.</h1><p>Your local wardrobe is still yours. Try opening this page once more.</p><button className="primary" onClick={reset}>Try once more</button></div></main>;}
