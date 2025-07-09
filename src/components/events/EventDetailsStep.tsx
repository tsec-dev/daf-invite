import React, { useState } from 'react';
import { EventData } from './EventWizard';

interface EventDetailsStepProps {
  initialData: EventData;
  onNext: (data: EventData) => void;
  onCancel: () => void;
}

export const EventDetailsStep: React.FC<EventDetailsStepProps> = ({ 
  initialData, 
  onNext, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<EventData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof EventData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (!formData.eventTime) {
      newErrors.eventTime = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!formData.contactEmail.includes('@')) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Event Details</h3>
        
        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Retirement Ceremony, Change of Command, Graduation"
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide details about the event, purpose, and any special instructions..."
              rows={4}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                min={today}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.eventDate && <p className="mt-1 text-sm text-red-400">{errors.eventDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) => handleChange('eventTime', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white ${
                  errors.eventTime ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.eventTime && <p className="mt-1 text-sm text-red-400">{errors.eventTime}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Base Auditorium, Officer's Club, Building 123"
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                errors.location ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
          </div>

          {/* Point of Contact Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Point of Contact *</h4>
            <div className="space-y-4">
              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="e.g., MSgt John Smith, Event Coordinator"
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                    errors.contactName ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.contactName && <p className="mt-1 text-sm text-red-400">{errors.contactName}</p>}
              </div>

              {/* Contact Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="john.smith@mail.mil"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.contactEmail && <p className="mt-1 text-sm text-red-400">{errors.contactEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.contactPhone && <p className="mt-1 text-sm text-red-400">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dress Code <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                value={formData.dresscode}
                onChange={(e) => handleChange('dresscode', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="">Select dress code</option>
                <option value="Service Dress">Service Dress</option>
                <option value="Mess Dress">Mess Dress</option>
                <option value="Business Casual">Business Casual</option>
                <option value="Formal Civilian">Formal Civilian</option>
                <option value="Semi-Formal">Semi-Formal</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Parking, security, special instructions..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Next: Design Invitation
          </button>
        </div>
      </div>
    </div>
  );
};