import React, { useState, useEffect } from 'react';
import { 
  WidgetConfig, WidgetTemplateId, GameItem, PublisherProperty 
} from '../../../types';
import { 
  getWidgetById, saveWidget, createNewWidgetDraft 
} from '../../../services/widgets';
import { getWebsites } from '../../../services/websites';
import { mockGames } from '../../../data/mockData';
import { mapTemplateToWidget } from '../../../config/widgetDefaults';
import { WidgetFlowProgress } from './WidgetFlowProgress';
import { TemplatePicker } from './TemplatePicker';
import { WidgetEditor } from './WidgetEditor';
import { InstallationPage } from '../installation/InstallationPage';

interface WidgetFlowProps {
  widgetId?: string;
  initialStep?: 1 | 2 | 3;
  onFinish: () => void;
  onViewAnalytics?: () => void;
  onPlayGame: (game: GameItem) => void;
}

export const WidgetFlow: React.FC<WidgetFlowProps> = ({
  widgetId,
  initialStep = 1,
  onFinish,
  onViewAnalytics,
  onPlayGame
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [websites, setWebsites] = useState<PublisherProperty[]>([]);
  const [widget, setWidget] = useState<WidgetConfig | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<WidgetTemplateId>('carousel');

  // Load properties and widget
  useEffect(() => {
    const props = getWebsites();
    setWebsites(props);

    if (widgetId) {
      const existing = getWidgetById(widgetId);
      if (existing) {
        setWidget(existing);
        if (existing.templateId) {
          setSelectedTemplateId(existing.templateId);
        }
        return;
      }
    }

    // Otherwise initialize new draft widget
    const newDraft = createNewWidgetDraft('carousel', props[0]?.id);
    setWidget(newDraft);
    setSelectedTemplateId('carousel');
  }, [widgetId]);

  if (!widget) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentProperty = websites.find(p => p.id === widget.propertyId) || websites[0] || {
    id: 'prop-default',
    name: 'My Website',
    domain: 'example.com',
    verified: false,
    verificationMethod: 'html_snippet',
    verificationToken: 'token-123',
    allowedOrigins: ['example.com'],
    publisherKey: 'pub_live_default123',
    createdAt: new Date().toISOString(),
    totalWidgets: 1
  };

  // Step 1 -> Step 2
  const handleTemplateSelect = (templateId: WidgetTemplateId) => {
    setSelectedTemplateId(templateId);
    const updated = mapTemplateToWidget(widget, templateId);
    const saved = saveWidget(updated);
    setWidget(saved);
  };

  const handleStep1Continue = () => {
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleWidgetChange = (updated: WidgetConfig) => {
    setWidget(updated);
    saveWidget(updated);
  };

  const handleStep2Continue = () => {
    // When advancing to install, set lifecycle to ready_to_install if it's currently draft
    const nextStatus = widget.lifecycleStatus === 'draft' ? 'ready_to_install' : (widget.lifecycleStatus || 'ready_to_install');
    const updated = {
      ...widget,
      lifecycleStatus: nextStatus
    };
    setWidget(updated);
    saveWidget(updated);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-16">
      {/* 3-Step Progress Indicator */}
      <WidgetFlowProgress
        currentStep={step}
        onStepClick={(targetStep) => setStep(targetStep)}
        canNavigateToStep={() => true}
      />

      {/* Step Views */}
      {step === 1 && (
        <TemplatePicker
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleTemplateSelect}
          onContinue={handleStep1Continue}
        />
      )}

      {step === 2 && (
        <WidgetEditor
          widget={widget}
          properties={websites}
          games={mockGames}
          onChange={handleWidgetChange}
          onPlayGame={onPlayGame}
          onBack={() => setStep(1)}
          onContinue={handleStep2Continue}
          lastSavedAt={widget.lastSavedAt}
        />
      )}

      {step === 3 && (
        <InstallationPage
          widget={widget}
          property={currentProperty}
          onBack={() => setStep(2)}
          onFinish={onFinish}
          onViewAnalytics={onViewAnalytics}
        />
      )}
    </div>
  );
};
