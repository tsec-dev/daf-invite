import React, { useState } from 'react';
import { EventData, DesignData } from './EventWizard';
import { StructuredInvitationDesigner } from './StructuredInvitationDesigner';

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

  const handleNext = () => {
    onNext(designData);
  };

  const handleDesignChange = (structuredDesign: any) => {
    // Convert structured design to DesignData format
    const updatedDesignData: DesignData = {
      ...designData,
      structuredInvitation: structuredDesign,
      // Keep the existing design data structure for compatibility
      background: {
        ...designData.background,
        value: structuredDesign.backgroundColor || designData.background.value
      },
      border: {
        ...designData.border,
        color: structuredDesign.borderColor || designData.border.color,
        enabled: true,
        width: 3,
        style: 'solid'
      }
    };
    setDesignData(updatedDesignData);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Design Your Invitation</h3>
        
        {/* Structured Designer Component */}
        <StructuredInvitationDesigner 
          eventData={eventData}
          onDesignChange={handleDesignChange}
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