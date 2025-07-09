import React, { useState } from 'react';
import { EventData, DesignData } from './EventWizard';

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

  const themes = [
    { id: 'military', name: 'Military Classic', preview: 'bg-gradient-to-br from-blue-900 to-gray-900' },
    { id: 'air-force', name: 'Air Force', preview: 'bg-gradient-to-br from-blue-800 to-blue-600' },
    { id: 'space-force', name: 'Space Force', preview: 'bg-gradient-to-br from-gray-900 to-purple-900' },
    { id: 'formal', name: 'Formal Black', preview: 'bg-gradient-to-br from-gray-800 to-black' },
  ];

  const backgrounds = [
    { id: 'gradient-dark', name: 'Dark Gradient', preview: 'bg-gradient-to-br from-gray-900 to-blue-900' },
    { id: 'gradient-blue', name: 'Blue Gradient', preview: 'bg-gradient-to-br from-blue-800 to-blue-600' },
    { id: 'solid-navy', name: 'Navy Blue', preview: 'bg-blue-900' },
    { id: 'solid-black', name: 'Black', preview: 'bg-black' },
  ];

  const handleThemeChange = (themeId: string) => {
    setDesignData(prev => ({ ...prev, theme: themeId }));
  };

  const handleBackgroundChange = (backgroundId: string) => {
    setDesignData(prev => ({ ...prev, background: backgroundId }));
  };

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

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Design Your Invitation</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Controls */}
          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Choose Theme</h4>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      designData.theme === theme.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-full h-12 rounded ${theme.preview} mb-2`}></div>
                    <p className="text-sm text-white font-medium">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Choose Background</h4>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundChange(bg.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      designData.background === bg.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-full h-12 rounded ${bg.preview} mb-2`}></div>
                    <p className="text-sm text-white font-medium">{bg.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
              <h4 className="text-lg font-semibold text-white mb-2">Coming Soon</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Custom logo upload</li>
                <li>• Drag & drop text elements</li>
                <li>• Military rank insignia</li>
                <li>• Custom fonts and colors</li>
              </ul>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
            <div className="bg-gray-900 rounded-lg p-4">
              {/* Mock Invitation Preview */}
              <div className={`w-full aspect-[3/4] rounded-lg ${backgrounds.find(bg => bg.id === designData.background)?.preview} p-8 text-white relative overflow-hidden`}>
                {/* Background Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border border-white/30 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{eventData.title || 'Event Title'}</h1>
                    <div className="w-24 h-0.5 bg-white/50 mx-auto"></div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">
                        {formatDate(eventData.eventDate, eventData.eventTime) || 'Event Date & Time'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-base opacity-90">
                        {eventData.location || 'Event Location'}
                      </p>
                    </div>

                    {eventData.description && (
                      <div className="mt-6">
                        <p className="text-sm opacity-80 leading-relaxed">
                          {eventData.description.length > 100 
                            ? eventData.description.substring(0, 100) + '...'
                            : eventData.description
                          }
                        </p>
                      </div>
                    )}

                    {eventData.dresscode && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">
                          Dress Code: {eventData.dresscode}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RSVP */}
                  <div className="text-center mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-3 px-4">
                      <p className="text-sm font-medium">Please RSVP</p>
                      <p className="text-xs opacity-80">{eventData.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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