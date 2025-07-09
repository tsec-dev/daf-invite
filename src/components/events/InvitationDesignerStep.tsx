import React, { useState } from 'react';
import { EventData, DesignData } from './EventWizard';
import { AdvancedInvitationDesigner } from './AdvancedInvitationDesigner';

interface InvitationDesignerStepProps {
  eventData: EventData;
  initialDesign: DesignData;
  onNext: (data: DesignData) => void;
  onBack: () => void;
}

export const InvitationDesignerStep: React.FC<InvitationDesignerStepProps> = ({
  eventData,
  initialDesign,
  onNext,
  onBack
}) => {
  const [designData, setDesignData] = useState<DesignData>(initialDesign);
  const [viewMode, setViewMode] = useState<'designer' | 'preview'>('designer');

  const handleNext = () => {
    onNext(designData);
  };

  // Format date for preview
  const formatDate = (date: string, time: string) => {
    if (!date) return '';
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) + ' at ' + dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate background CSS
  const generateBackgroundCSS = () => {
    if (designData.background.type === 'gradient' && designData.background.gradientColors) {
      const colors = designData.background.gradientColors.join(', ');
      return `linear-gradient(${designData.background.gradientDirection}deg, ${colors})`;
    }
    return designData.background.value;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Design Your Invitation</h3>
        
        {/* Advanced Designer Component */}
        <AdvancedInvitationDesigner 
          eventData={eventData}
          designData={designData}
          onDesignChange={setDesignData}
        />

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Back: Event Details
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Next: Save Event
          </button>
        </div>
      </div>
    </div>
  );
};