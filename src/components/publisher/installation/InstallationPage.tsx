import React, { useState } from 'react';
import { 
  WidgetConfig, PublisherProperty, InstallationPlatform, WidgetLifecycleStatus 
} from '../../../types';
import { generateEmbedCode, generateDeveloperEmailBody } from '../../../utils/embedCode';
import { PLATFORM_INSTRUCTIONS, getPlatformInstructions } from '../../../config/platformInstructions';
import { verifyWidgetInstallation, confirmManualInstallation } from '../../../services/installationVerification';
import { updateWidgetLifecycle } from '../../../services/widgets';
import { 
  Copy, Check, ExternalLink, Mail, AlertTriangle, 
  CheckCircle2, ArrowLeft, RefreshCw, HelpCircle, Code, ShieldCheck, Globe
} from 'lucide-react';

interface InstallationPageProps {
  widget: WidgetConfig;
  property: PublisherProperty;
  onBack: () => void;
  onFinish: () => void;
  onViewAnalytics?: () => void;
}

export const InstallationPage: React.FC<InstallationPageProps> = ({
  widget,
  property,
  onBack,
  onFinish,
  onViewAnalytics
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<InstallationPlatform>('wordpress');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState<boolean>(false);
  const [developerEmail, setDeveloperEmail] = useState<string>('');
  
  // Verification states
  const [testUrl, setTestUrl] = useState<string>(
    widget.targetPageUrl || `https://${property.domain}`
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message?: string;
    details?: string;
  }>({
    status: widget.lifecycleStatus === 'live' ? 'success' : 'idle',
    message: widget.lifecycleStatus === 'live' ? 'Installation verified and live.' : undefined
  });

  const instructions = getPlatformInstructions(selectedPlatform);
  
  // Generate embed code for current platform
  const embedCodeSnippet = generateEmbedCode({
    widgetId: widget.id,
    publisherKey: property.publisherKey,
    layout: widget.layout,
    platform: selectedPlatform
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCodeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleCopyEmail = async () => {
    const emailBody = generateDeveloperEmailBody({
      widgetName: widget.name,
      domain: property.domain,
      embedCode: embedCodeSnippet
    });
    try {
      await navigator.clipboard.writeText(emailBody);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (e) {
      console.error('Failed to copy developer brief', e);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult({ status: 'idle' });

    const result = await verifyWidgetInstallation({
      widget,
      targetUrl: testUrl,
      property,
      clientCheckMethod: 'automated_fetch'
    });

    setIsVerifying(false);

    if (result.success) {
      updateWidgetLifecycle(widget.id, 'live', {
        status: 'verified',
        pageUrl: testUrl,
        lastCheckedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
      });
      setVerificationResult({
        status: 'success',
        message: result.message
      });
    } else {
      updateWidgetLifecycle(widget.id, 'installation_error', {
        status: 'error',
        pageUrl: testUrl,
        lastCheckedAt: new Date().toISOString(),
        errorMessage: result.message
      });
      setVerificationResult({
        status: 'error',
        message: result.message,
        details: result.diagnosticDetails
      });
    }
  };

  const handleManualConfirm = () => {
    confirmManualInstallation(widget.id, testUrl);
    updateWidgetLifecycle(widget.id, 'live', {
      status: 'verified',
      pageUrl: testUrl,
      lastCheckedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    });
    setVerificationResult({
      status: 'success',
      message: 'Widget confirmed as installed! It is now active on your website.'
    });
  };

  const handleSaveReadyToInstall = () => {
    updateWidgetLifecycle(widget.id, 'ready_to_install', {
      status: 'not_started',
      pageUrl: testUrl,
      lastCheckedAt: new Date().toISOString()
    });
    onFinish();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to Customise"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 leading-tight">
              Install widget on your website
            </h1>
            <p className="text-xs text-slate-600">
              Paste the code snippet on <span className="font-semibold text-slate-900">{property.domain}</span> to start engaging visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDeveloperModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Send to developer</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Embed code & platform guide (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step A: Platform Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <label className="block text-xs font-bold font-display uppercase tracking-wider text-slate-700 mb-3">
              1. Choose your website platform
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'wordpress', name: 'WordPress' },
                { id: 'shopify', name: 'Shopify' },
                { id: 'webflow', name: 'Webflow' },
                { id: 'wix', name: 'Wix' },
                { id: 'react', name: 'React/Next' },
                { id: 'other', name: 'Other HTML' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id as InstallationPlatform)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    selectedPlatform === p.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step B: The Embed Code */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                2. Copy embed code snippet
              </label>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                  copiedCode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#D6F938] hover:bg-[#cbf028] text-slate-950'
                }`}
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-blue-200 overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre-wrap break-all leading-relaxed">
                {embedCodeSnippet}
              </pre>
            </div>

            <p className="text-[11px] text-slate-600 mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Standard lightweight DochGames embed script with async loading. No cookies required.
              </span>
            </p>
          </div>

          {/* Step C: Platform Instructions */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 mb-3">
              3. How to paste on {instructions.name}
            </h3>

            <div className="space-y-3">
              {instructions.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="leading-relaxed">
                    {st}
                  </div>
                </div>
              ))}
            </div>

            {instructions.recommendedPlacement && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                <span className="font-bold">Recommended location:</span>
                <span>{instructions.recommendedPlacement}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification & Finish Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Honest Verification Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">
                Check installation
              </h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Verify that the code was placed properly and is ready to show games to your audience.
            </p>

            {/* Test URL input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your page address
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder={`https://${property.domain}`}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
                />
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Verify CTA */}
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleVerify}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Checking your website...' : 'Verify installation now'}</span>
            </button>

            {/* Result Display: Honest Success */}
            {verificationResult.status === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Installation confirmed live!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {verificationResult.message}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onFinish}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    View in Widgets List
                  </button>
                  {onViewAnalytics && (
                    <button
                      type="button"
                      onClick={onViewAnalytics}
                      className="w-full py-2 rounded-xl border border-emerald-300 hover:bg-emerald-100/60 text-emerald-900 font-bold text-xs transition-all"
                    >
                      Go to Analytics
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Result Display: Honest Diagnostics on Failure */}
            {verificationResult.status === 'error' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Widget not detected yet</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {verificationResult.message}
                </p>
                {verificationResult.details && (
                  <p className="text-[11px] text-amber-700 bg-amber-100/50 p-2 rounded-lg">
                    {verificationResult.details}
                  </p>
                )}

                {/* Clear Honest Options */}
                <div className="pt-2 space-y-2 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={handleManualConfirm}
                    className="w-full py-2 rounded-xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-bold text-xs transition-all shadow-xs"
                  >
                    I have added the code (Mark as Live)
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReadyToInstall}
                    className="w-full py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-all"
                  >
                    Finish later (Save as Ready to install)
                  </button>
                </div>
              </div>
            )}

            {/* General Save Ready action if not verified yet */}
            {verificationResult.status === 'idle' && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveReadyToInstall}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all"
                >
                  Save & Finish Later
                </button>
              </div>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Need help installing?</span>
            </div>
            <p className="leading-relaxed">
              If your website uses a caching plugin like WP Rocket, Cloudflare, or LiteSpeed, you may need to purge the cache after pasting the code snippet.
            </p>
          </div>
        </div>
      </div>

      {/* Send to Developer Modal */}
      {showDeveloperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Send installation code to developer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeveloperModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Share the complete snippet and instructions with your web engineer or agency.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Developer email address
              </label>
              <input
                type="email"
                value={developerEmail}
                onChange={(e) => setDeveloperEmail(e.target.value)}
                placeholder="developer@yourcompany.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
              />
            </div>

            {/* Brief preview */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message brief
              </label>
              <textarea
                readOnly
                rows={5}
                value={generateDeveloperEmailBody({
                  widgetName: widget.name,
                  domain: property.domain,
                  embedCode: embedCodeSnippet
                })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied brief!' : 'Copy brief'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const subject = encodeURIComponent(`Install DochGames Widget for ${property.domain}`);
                  const body = encodeURIComponent(
                    generateDeveloperEmailBody({
                      widgetName: widget.name,
                      domain: property.domain,
                      embedCode: embedCodeSnippet
                    })
                  );
                  window.open(`mailto:${developerEmail}?subject=${subject}&body=${body}`);
                  setShowDeveloperModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open in email client</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
