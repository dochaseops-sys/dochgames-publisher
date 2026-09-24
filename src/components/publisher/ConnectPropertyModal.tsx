import React, { useState } from 'react';
import { 
  X, Globe, Key, CheckCircle, ShieldCheck, Copy, 
  ExternalLink, ArrowRight, RefreshCw, AlertCircle 
} from 'lucide-react';
import { PublisherProperty } from '../../types';
import { GigaMascot } from '../common/GigaMascot';

interface ConnectPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: (property: PublisherProperty) => void;
}

export const ConnectPropertyModal: React.FC<ConnectPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyCreated
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [siteName, setSiteName] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<'dns_txt' | 'meta_tag'>('dns_txt');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [generatedProperty, setGeneratedProperty] = useState<PublisherProperty | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartVerification = () => {
    if (!siteName.trim() || !domain.trim()) {
      setVerificationError('Please enter both your property name and root domain.');
      return;
    }

    setVerificationError(null);
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const token = `doch-verify=${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
    const pubKey = `pub_live_${Math.random().toString(36).substring(2, 8)}_${Math.random().toString(36).substring(2, 10)}`;

    const newProp: PublisherProperty = {
      id: `prop-${Date.now()}`,
      name: siteName,
      domain: cleanDomain,
      verified: false,
      verificationMethod,
      verificationToken: token,
      allowedOrigins: [`https://${cleanDomain}`, `https://www.${cleanDomain}`],
      publisherKey: pubKey,
      createdAt: new Date().toISOString(),
      totalWidgets: 0
    };

    setGeneratedProperty(newProp);
    setStep(2);
  };

  const handleConfirmVerification = () => {
    if (!generatedProperty) return;
    setIsVerifying(true);
    setVerificationError(null);

    // Simulate instant DNS / Meta tag lookup check
    setTimeout(() => {
      setIsVerifying(false);
      const verifiedProp: PublisherProperty = {
        ...generatedProperty,
        verified: true
      };
      setGeneratedProperty(verifiedProp);
      onPropertyCreated(verifiedProp);
      setStep(3);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Connect Site or App
              </h3>
              <p className="text-xs text-slate-500">
                Step {step} of 3 · Automated property registration & credential issue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-7 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Property or App Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Gaming Portal"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Website URL / Host Domain
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">https://</span>
                  <input
                    type="text"
                    placeholder="apexgaming.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-18 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ownership Verification Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setVerificationMethod('dns_txt')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      verificationMethod === 'dns_txt'
                        ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs mb-0.5 text-slate-900">DNS TXT Record</div>
                    <div className="text-[11px] text-slate-500">Add TXT entry to your domain DNS</div>
                  </div>

                  <div
                    onClick={() => setVerificationMethod('meta_tag')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      verificationMethod === 'meta_tag'
                        ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs mb-0.5 text-slate-900">HTML Meta Tag</div>
                    <div className="text-[11px] text-slate-500">Insert tag into HTML &lt;head&gt;</div>
                  </div>
                </div>
              </div>

              {verificationError && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{verificationError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleStartVerification}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  Continue to Verification
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && generatedProperty && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  {verificationMethod === 'dns_txt' 
                    ? '1. Add this DNS TXT record to your registrar' 
                    : '1. Paste this meta tag into your homepage <head>'}
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-[#D6F938] break-all select-all shadow-inner">
                  <span>
                    {verificationMethod === 'dns_txt' 
                      ? generatedProperty.verificationToken 
                      : `<meta name="dochgames-site-verification" content="${generatedProperty.verificationToken}" />`}
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      verificationMethod === 'dns_txt' 
                        ? generatedProperty.verificationToken 
                        : `<meta name="dochgames-site-verification" content="${generatedProperty.verificationToken}" />`
                    )}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white shrink-0 ml-2 hover:bg-white/10"
                    title="Copy token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                Once added, click <strong className="text-slate-800">Verify Domain Ownership</strong>. DochGames will test the DNS/HTML handshake and issue your permanent Publisher Key.
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmVerification}
                  disabled={isVerifying}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Checking Records...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Verify Domain Ownership
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && generatedProperty && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display text-xl font-bold text-slate-900 mb-1">
                  Property Verified Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  {generatedProperty.name} ({generatedProperty.domain}) is registered and authorized.
                </p>
              </div>

              {/* Publisher Key Display */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    Generated Publisher Key
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">STATUS: ACTIVE</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-white shadow-inner">
                  <span className="select-all">{generatedProperty.publisherKey}</span>
                  <button
                    onClick={() => copyToClipboard(generatedProperty.publisherKey)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs hover:bg-white/30 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedKey ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  All widgets created for this property will automatically inherit this key for monetization attribution.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  Done & Go to Widget Builder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectPropertyModal;
