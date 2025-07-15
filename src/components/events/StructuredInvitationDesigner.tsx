import React, { useState } from 'react';
import { EventData } from './EventWizard';

interface StructuredInvitationData {
  headerImage?: string;
  issuingAuthority: string;
  eventType: string;
  keyParticipants: string;
  dateTime: string;
  location: string;
  dressCode: string;
  rsvpInstructions: string;
  footerLogo?: string;
  borderColor: string;
  backgroundColor: string;
}

interface StructuredInvitationDesignerProps {
  eventData: EventData;
  onDesignChange: (design: StructuredInvitationData) => void;
}

export const StructuredInvitationDesigner: React.FC<StructuredInvitationDesignerProps> = ({
  eventData,
  onDesignChange
}) => {
  const [design, setDesign] = useState<StructuredInvitationData>({
    issuingAuthority: '',
    eventType: eventData.title || '',
    keyParticipants: '',
    dateTime: `${eventData.eventDate} at ${eventData.eventTime}`,
    location: eventData.location || '',
    dressCode: eventData.dresscode || 'Business Attire',
    rsvpInstructions: `Please RSVP to ${eventData.contactName} at ${eventData.contactEmail}`,
    borderColor: '#002596',
    backgroundColor: '#ffffff'
  });

  const handleChange = (field: keyof StructuredInvitationData, value: string) => {
    const newDesign = { ...design, [field]: value };
    setDesign(newDesign);
    onDesignChange(newDesign);
  };

  const handleImageUpload = (field: 'headerImage' | 'footerLogo', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleChange(field, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Form Controls */}
      <div className="space-y-6 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Invitation Content</h3>
          
          {/* Header Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Header Image/Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('headerImage', e.target.files[0])}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Issuing Authority */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Issuing Authority</label>
            <input
              type="text"
              value={design.issuingAuthority}
              onChange={(e) => handleChange('issuingAuthority', e.target.value)}
              placeholder="e.g., Brigadier General John Smith"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Event Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
            <input
              type="text"
              value={design.eventType}
              onChange={(e) => handleChange('eventType', e.target.value)}
              placeholder="e.g., Change of Command Ceremony"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Key Participants */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Participants</label>
            <input
              type="text"
              value={design.keyParticipants}
              onChange={(e) => handleChange('keyParticipants', e.target.value)}
              placeholder="e.g., Colonel Jane Doe and Colonel John Smith"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Date & Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
            <input
              type="text"
              value={design.dateTime}
              onChange={(e) => handleChange('dateTime', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={design.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Dress Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Dress Code</label>
            <input
              type="text"
              value={design.dressCode}
              onChange={(e) => handleChange('dressCode', e.target.value)}
              placeholder="e.g., Military: Dress Blues, Civilian: Business Attire"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* RSVP Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">RSVP Instructions</label>
            <textarea
              value={design.rsvpInstructions}
              onChange={(e) => handleChange('rsvpInstructions', e.target.value)}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Footer Logo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Footer Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('footerLogo', e.target.files[0])}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        {/* Styling Controls */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Styling</h3>
          
          {/* Border Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Border Color</label>
            <input
              type="color"
              value={design.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
            />
          </div>

          {/* Background Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
            <input
              type="color"
              value={design.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg" style={{
          backgroundColor: design.backgroundColor,
          border: `3px solid ${design.borderColor}`,
          fontFamily: 'Georgia, serif'
        }}>
          {/* Header Image */}
          {design.headerImage && (
            <div className="text-center mb-6">
              <img 
                src={design.headerImage} 
                alt="Header" 
                className="max-h-24 mx-auto object-contain"
              />
            </div>
          )}

          {/* Issuing Authority */}
          {design.issuingAuthority && (
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-navy-900" style={{ color: design.borderColor }}>
                {design.issuingAuthority}
              </p>
            </div>
          )}

          {/* Event Type */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-navy-900 mb-2" style={{ color: design.borderColor }}>
              {design.eventType}
            </h1>
          </div>

          {/* Key Participants */}
          {design.keyParticipants && (
            <div className="text-center mb-6">
              <p className="text-lg text-navy-900" style={{ color: design.borderColor }}>
                {design.keyParticipants}
              </p>
            </div>
          )}

          {/* Date & Time */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-navy-900" style={{ color: design.borderColor }}>
              {design.dateTime}
            </p>
          </div>

          {/* Location */}
          <div className="text-center mb-6">
            <p className="text-lg text-navy-900" style={{ color: design.borderColor }}>
              {design.location}
            </p>
          </div>

          {/* Dress Code */}
          <div className="text-center mb-6">
            <p className="text-sm text-navy-800" style={{ color: design.borderColor }}>
              <strong>Dress Code:</strong> {design.dressCode}
            </p>
          </div>

          {/* RSVP Instructions */}
          <div className="text-center mb-6">
            <p className="text-sm text-navy-800" style={{ color: design.borderColor }}>
              {design.rsvpInstructions}
            </p>
          </div>

          {/* Footer Logo */}
          {design.footerLogo && (
            <div className="text-center">
              <img 
                src={design.footerLogo} 
                alt="Footer Logo" 
                className="max-h-16 mx-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};