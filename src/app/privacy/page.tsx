'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-xs text-gray-500 hover:text-white mb-8 block">← Back</Link>

      <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-base mb-2">1. Overview</h2>
          <p>Starting 6 (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a browser-based volleyball draft game operated by Rafael Palomares, Wabern, Switzerland. We take your privacy seriously and are committed to protecting your personal data in accordance with the Swiss Federal Data Protection Act (FADP) and the EU General Data Protection Regulation (GDPR).</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">2. Data We Collect</h2>
          <p><strong className="text-gray-300">Local Storage Data:</strong> Game progress, preferences, premium status, and play history are stored locally on your device using browser localStorage. This data never leaves your device.</p>
          <p className="mt-2"><strong className="text-gray-300">Analytics:</strong> We use Google Analytics to collect anonymized usage data (page views, session duration, device type). No personally identifiable information is collected.</p>
          <p className="mt-2"><strong className="text-gray-300">Payment Data:</strong> If you purchase Premium, payment processing is handled entirely by Stripe. We never see or store your credit card details.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">3. Cookies &amp; Advertising</h2>
          <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-court-accent hover:underline" target="_blank" rel="noopener">Google Ads Settings</a>.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">4. Data Sharing</h2>
          <p>We do not sell, rent, or trade your personal information to third parties. Data is only shared with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Google (Analytics &amp; AdSense) — anonymized usage data</li>
            <li>Stripe — payment processing only</li>
            <li>Vercel — hosting provider</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">5. Your Rights</h2>
          <p>Under GDPR/FADP, you have the right to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Access your data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of analytics and personalized ads</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at the address below.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">6. Data Retention</h2>
          <p>Local storage data persists until you clear your browser data. Analytics data is retained by Google for 14 months. Payment records are retained by Stripe per their retention policy.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-base mb-2">7. Contact</h2>
          <p>Rafael Palomares<br />Gurtenbrauerei 70<br />3084 Wabern<br />Switzerland</p>
          <p className="mt-2">Email: contact@starting6.app</p>
        </section>
      </div>
    </div>
  );
}
