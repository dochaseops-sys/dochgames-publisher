import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, 
  MessageCircle, Mail, ExternalLink, ShieldCheck, Zap, Code 
} from 'lucide-react';
import { PLATFORM_INSTRUCTIONS } from '../../../config/platformInstructions';

export const PublisherHelpPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedGuidePlatform, setSelectedGuidePlatform] = useState<string>('wordpress');

  const faqs = [
    {
      q: 'Why is my widget not appearing on my website after pasting the code?',
      a: 'The most common cause is website caching. If you use a caching plugin (such as WP Rocket, LiteSpeed Cache, or Cloudflare), purge your page cache and refresh with Cmd+Shift+R (Mac) or Ctrl+F5 (Windows). Also check that your browser does not have an aggressive ad-blocker blocking script execution on localhost or staging domains.'
    },
    {
      q: 'Will embedding DochGames slow down my website or affect Google Core Web Vitals?',
      a: 'No. DochGames embed scripts are completely asynchronous and lightweight (under 12KB). Game assets and heavy WebGL runtimes are lazy-loaded only when a visitor actually clicks to launch a game. Your initial page speed and Google PageSpeed scores remain protected.'
    },
    {
      q: 'How does publisher monetisation and rev-share work?',
      a: 'Games provided by DochGames are integrated with non-intrusive rewarded ads and standard interstitial sponsors. As players on your website play games, ad revenue is tracked in your DochGames Publisher account. Earnings are settled monthly with transparent rev-share payouts.'
    },
    {
      q: 'Can I restrict games to specific genres like Puzzle or Racing?',
      a: 'Yes. In the Customise step of your widget builder, under "Game Content", choose "By genre" and select the desired category. You can also pick "Handpicked" to curate specific titles that align with your audience.'
    },
    {
      q: 'What is the difference between Live, Ready to install, and Draft?',
      a: 'Draft means you are still customising the widget. Ready to install means you have saved the settings and are ready to copy the snippet onto your website. Live means DochGames has verified or you have confirmed that the widget is embedded on your website and actively serving games.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          Help & Installation Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Everything you need to install, configure, and troubleshoot your game widgets.
        </p>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">5-Minute Setup</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create a widget, copy the single snippet, and paste into your CMS. No coding or API keys required.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Safe & Compliant</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All games run in secure isolated sandboxes without third-party tracking cookies or invasive permissions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Universal CMS Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Works out of the box with WordPress, Shopify, Webflow, Wix, Squarespace, Ghost, and custom React apps.
          </p>
        </div>
      </div>

      {/* Platform Step-by-Step Guides */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
              CMS Installation Walkthroughs
            </h2>
          </div>
        </div>

        {/* Platform Buttons */}
        <div className="flex flex-wrap gap-2">
          {PLATFORM_INSTRUCTIONS.map(p => (
            <button
              key={p.platform}
              type="button"
              onClick={() => setSelectedGuidePlatform(p.platform)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                selectedGuidePlatform === p.platform
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Selected Guide Details */}
        {(() => {
          const guide = PLATFORM_INSTRUCTIONS.find(p => p.platform === selectedGuidePlatform) || PLATFORM_INSTRUCTIONS[0];
          return (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Installing on {guide.name}</span>
              </h3>

              <div className="space-y-3">
                {guide.steps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="leading-relaxed">
                      {s}
                    </div>
                  </div>
                ))}
              </div>

              {guide.recommendedPlacement && (
                <div className="pt-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Best location: </span>
                  <span>{guide.recommendedPlacement}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl">
            Still need assistance?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Our publisher support team is available to help verify code installation on your domain.
          </p>
        </div>

        <a
          href="mailto:support@dochgames.com?subject=Publisher%20Widget%20Assistance"
          className="px-5 py-2.5 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shrink-0"
        >
          <Mail className="w-4 h-4 text-slate-950" />
          <span>Email Publisher Support</span>
        </a>
      </div>
    </div>
  );
};
