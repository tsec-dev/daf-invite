import React, { useState } from 'react';
import { EventDetailsStep } from './EventDetailsStep';
import { InvitationDesignerStep } from './InvitationDesignerStep';
import { EventCompleteStep } from './EventCompleteStep';

export interface EventData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  contactEmail: string;
  dresscode?: string;
  notes?: string;
}

export interface DesignData {
  elements: any[];
  background: string;
  theme: string;
}

interface EventWizardProps {
  userEmail: string;
  onClose: () => void;
}

type WizardStep = 'details' | 'designer' | 'complete';

export const EventWizard: React.FC<EventWizardProps> = ({ userEmail, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    contactEmail: userEmail,
    dresscode: '',
    notes: ''
  });
  const [designData, setDesignData] = useState<DesignData>({
    elements: [],
    background: 'gradient-dark',
    theme: 'military'
  });
  const [eventId, setEventId] = useState<string>('');

  const handleDetailsComplete = (data: EventData) => {
    setEventData(data);
    setCurrentStep('designer');
  };

  const handleDesignComplete = (data: DesignData) => {
    setDesignData(data);
    setCurrentStep('complete');
  };

  const handleEventSaved = (id: string) => {
    setEventId(id);
  };

  const getStepNumber = (step: WizardStep): number => {
    switch (step) {
      case 'details': return 1;
      case 'designer': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700/50">
        {/* Header with Steps */}
        <div className="bg-gray-900/80 px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create Event</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${currentStep === 'details' ? 'text-blue-400' : getStepNumber(currentStep) > 1 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                currentStep === 'details' ? 'border-blue-400 bg-blue-400/20' : 
                getStepNumber(currentStep) > 1 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
              }`}>
                {getStepNumber(currentStep) > 1 ? '✓' : '1'}
              </div>
              <span className="ml-2 font-medium">Event Details</span>
            </div>
            
            <div className={`w-8 h-0.5 ${getStepNumber(currentStep) > 1 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'designer' ? 'text-blue-400' : getStepNumber(currentStep) > 2 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                currentStep === 'designer' ? 'border-blue-400 bg-blue-400/20' : 
                getStepNumber(currentStep) > 2 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
              }`}>
                {getStepNumber(currentStep) > 2 ? '✓' : '2'}
              </div>
              <span className="ml-2 font-medium">Design Invitation</span>
            </div>
            
            <div className={`w-8 h-0.5 ${getStepNumber(currentStep) > 2 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'complete' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                currentStep === 'complete' ? 'border-blue-400 bg-blue-400/20' : 'border-gray-500'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {currentStep === 'details' && (
            <EventDetailsStep
              initialData={eventData}
              onNext={handleDetailsComplete}
              onCancel={onClose}
            />
          )}
          
          {currentStep === 'designer' && (
            <InvitationDesignerStep
              eventData={eventData}
              initialDesign={designData}
              onNext={handleDesignComplete}
              onBack={() => setCurrentStep('details')}
            />
          )}
          
          {currentStep === 'complete' && (
            <EventCompleteStep
              eventData={eventData}
              designData={designData}
              userEmail={userEmail}
              onEventSaved={handleEventSaved}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};