'use client';

import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-xs text-gray-500 hover:text-white mb-8 block">← Back</Link>

      <h1 className="text-3xl font-black mb-8">Imprint</h1>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-base mb-2">Responsible Person</h2>
          <p className="text-gray-300">Rafael Palomares</p>
          <p>Gurtenbrauerei 70<br />3084 Wabern<br />Switzerland</p>
          <p className="mt-2">Email: contact@starting6.app</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">Disclaimer</h2>
          <p>Starting 6 is an independent project. We are not affiliated with, endorsed by, or connected to the FIVB, Volleyball Nations League, or any national volleyball federation. Player data is used for entertainment purposes only.</p>
        </section>
      </div>
    </div>
  );
}
