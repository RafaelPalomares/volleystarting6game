'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-xs text-gray-500 hover:text-white mb-8 block">← Back</Link>

      <h1 className="text-3xl font-black mb-2">Terms of Use</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-base mb-2">1. Acceptance</h2>
          <p>By accessing or using Starting 6, you agree to be bound by these Terms of Use. If you do not agree, please do not use the service.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">2. Description of Service</h2>
          <p>Starting 6 is a free-to-play browser game where users draft volleyball players to build a team lineup. The game uses publicly available statistical data from professional volleyball competitions.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">3. Premium Features</h2>
          <p>Optional premium features are available for a one-time payment of €3.99. Premium purchases are non-refundable except where required by applicable law. Premium status is tied to your browser/device via local storage.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">4. Intellectual Property</h2>
          <p>The Starting 6 game concept, code, and design are owned by Rafael Palomares. Player names and statistical data are used for informational and entertainment purposes under fair use. We are not affiliated with FIVB, any national volleyball federation, or any individual player.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Attempt to manipulate or exploit the game</li>
            <li>Scrape or extract data from the service</li>
            <li>Use the service for any illegal purpose</li>
            <li>Interfere with the service&apos;s operation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">6. Disclaimer</h2>
          <p>The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee accuracy of player statistics or uninterrupted service availability.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">8. Governing Law</h2>
          <p>These terms are governed by the laws of Switzerland. Any disputes shall be resolved in the courts of Bern, Switzerland.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">9. Contact</h2>
          <p>Rafael Palomares<br />Gurtenbrauerei 70<br />3084 Wabern<br />Switzerland</p>
        </section>
      </div>
    </div>
  );
}
