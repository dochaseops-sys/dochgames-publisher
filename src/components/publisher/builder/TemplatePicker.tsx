import React from 'react';
import { WidgetTemplateId } from '../../../types';
import { WIDGET_TEMPLATES, WidgetTemplateDefinition } from '../../../config/widgetTemplates';
import { Sparkles, Check, ArrowRight, Layout, Play, Gamepad2, Layers } from 'lucide-react';

interface TemplatePickerProps {
  selectedTemplateId: WidgetTemplateId;
  onSelectTemplate: (templateId: WidgetTemplateId) => void;
  onContinue: () => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onContinue
}) => {
  const renderTemplateIllustration = (templateId: WidgetTemplateId) => {
    switch (templateId) {
      case 'carousel':
        return (
          <div className="w-full h-32 bg-slate-900 rounded-xl p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <span className="h-2 w-16 bg-blue-400/60 rounded"></span>
              <span className="h-1.5 w-8 bg-slate-600 rounded"></span>
            </div>
            <div className="flex gap-2 -mx-1">
              <div className="w-1/3 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1.5 flex flex-col justify-end">
                <span className="h-1.5 w-10 bg-white/80 rounded mb-0.5"></span>
                <span className="h-1 w-6 bg-white/40 rounded"></span>
              </div>
              <div className="w-1/3 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-1.5 flex flex-col justify-end ring-2 ring-[#D6F938]">
                <span className="h-1.5 w-10 bg-white/80 rounded mb-0.5"></span>
                <span className="h-1 w-6 bg-white/40 rounded"></span>
              </div>
              <div className="w-1/3 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-1.5 flex flex-col justify-end">
                <span className="h-1.5 w-10 bg-white/80 rounded mb-0.5"></span>
                <span className="h-1 w-6 bg-white/40 rounded"></span>
              </div>
            </div>
            <div className="flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6F938]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            </div>
          </div>
        );

      case 'featured':
        return (
          <div className="w-full h-32 bg-slate-900 rounded-xl p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
            <div className="flex gap-3 h-full">
              <div className="w-2/3 h-full bg-gradient-to-br from-rose-500 to-amber-600 rounded-lg p-2 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                  <Play className="w-2.5 h-2.5 fill-current text-[#D6F938]" />
                </div>
                <span className="h-2 w-14 bg-white rounded mb-1"></span>
                <span className="h-1.5 w-20 bg-white/60 rounded"></span>
              </div>
              <div className="w-1/3 flex flex-col justify-between gap-1.5">
                <div className="h-1/2 bg-slate-800 rounded-md p-1 flex items-center gap-1">
                  <div className="w-4 h-4 bg-purple-500 rounded shrink-0"></div>
                  <div className="w-full h-1 bg-slate-600 rounded"></div>
                </div>
                <div className="h-1/2 bg-slate-800 rounded-md p-1 flex items-center gap-1">
                  <div className="w-4 h-4 bg-cyan-500 rounded shrink-0"></div>
                  <div className="w-full h-1 bg-slate-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="w-full h-32 bg-slate-900 rounded-xl p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
            <div className="grid grid-cols-2 gap-2 h-full">
              <div className="bg-slate-800/80 rounded-lg p-1.5 flex flex-col justify-between border border-slate-700">
                <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
                <div className="space-y-0.5">
                  <span className="h-1.5 w-12 bg-white/80 block rounded"></span>
                  <span className="h-1 w-8 bg-blue-400 block rounded"></span>
                </div>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-1.5 flex flex-col justify-between border border-slate-700">
                <div className="w-full h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
                <div className="space-y-0.5">
                  <span className="h-1.5 w-12 bg-white/80 block rounded"></span>
                  <span className="h-1 w-8 bg-amber-400 block rounded"></span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'floating':
        return (
          <div className="w-full h-32 bg-slate-900 rounded-xl p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
            <div className="w-full space-y-1.5 opacity-40">
              <div className="h-2 w-24 bg-slate-600 rounded"></div>
              <div className="h-1.5 w-full bg-slate-700 rounded"></div>
              <div className="h-1.5 w-4/5 bg-slate-700 rounded"></div>
            </div>
            <div className="flex justify-end items-end">
              <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1.5 rounded-full shadow-lg border border-white/20">
                <Gamepad2 className="w-3.5 h-3.5 text-[#D6F938]" />
                <span className="text-[10px] font-bold">Games</span>
                <span className="w-2 h-2 rounded-full bg-[#D6F938] animate-ping"></span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Step 1: Select widget format
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          Choose a game widget template
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Pick the layout that best suits your website. You can customise colours, games, and sizes in the next step.
        </p>
      </div>

      {/* 4 Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {WIDGET_TEMPLATES.map((tpl: WidgetTemplateDefinition) => {
          const isSelected = selectedTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl.id);
              }}
              className={`group relative bg-white rounded-3xl p-5 sm:p-6 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-xl ${
                isSelected
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Recommended Badge */}
              {(tpl.recommended || tpl.isRecommended) && (
                <div className="absolute -top-3 left-6 bg-[#D6F938] text-slate-950 px-3 py-0.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Recommended for most sites
                </div>
              )}

              <div>
                {/* Visual Illustration */}
                <div className="mb-4">
                  {renderTemplateIllustration(tpl.id)}
                </div>

                {/* Card Title & Selected Checkmark */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Best placement: <span className="text-slate-800 font-semibold">{tpl.bestFor || tpl.recommendedFor?.[0] || 'Editorial pages'}</span>
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'border-2 border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Key Benefits */}
                <ul className="space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                  {(tpl.features || tpl.recommendedFor || []).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(tpl.id);
                  onContinue();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-[#D6F938] text-slate-950 hover:bg-[#cbf028] shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isSelected ? 'Customise this template' : 'Choose this template'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Bottom Bar on Mobile/Desktop */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>Continue to Customise & Preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
