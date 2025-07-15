import React, { useState, useEffect } from 'react';
import { EventData, DesignData } from './EventWizard';
import { supabase } from '../../services/supabase';

interface EventCompleteStepProps {
  eventData: EventData;
  designData: DesignData;
  userEmail: string;
  onEventSaved: (eventId: string) => void;
  onClose: () => void;
}

export const EventCompleteStep: React.FC<EventCompleteStepProps> = ({
  eventData,
  designData,
  userEmail,
  onEventSaved,
  onClose
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [eventId, setEventId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [rsvpLink, setRsvpLink] = useState<string>('');

  useEffect(() => {
    saveEvent();
  }, []);

  const saveEvent = async () => {
    setIsSaving(true);
    setError('');

    try {
      console.log('Starting event save process...');
      console.log('Event data:', eventData);
      console.log('Design data:', designData);
      console.log('User email:', userEmail);
      
      // Test Supabase connection
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('events')
        .select('count')
        .limit(1);
      
      console.log('Supabase connection test:', { testData, testError });
      
      if (testError) {
        console.error('Supabase connection failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      // Combine event date and time
      const eventDateTime = new Date(`${eventData.eventDate}T${eventData.eventTime}`).toISOString();
      console.log('Combined event date/time:', eventDateTime);

      // Prepare the data to be inserted
      const insertData = {
        title: eventData.title,
        description: eventData.description,
        event_date: eventDateTime,
        location: eventData.location,
        contact_name: eventData.contactName,
        contact_phone: eventData.contactPhone,
        contact_email: eventData.contactEmail,
        dresscode: eventData.dresscode,
        notes: eventData.notes,
        created_by_email: userEmail,
        design_data: designData
      };

      console.log('Insert data:', insertData);

      // Save event to Supabase
      const { data, error: insertError } = await supabase
        .from('events')
        .insert(insertData)
        .select()
        .single();

      console.log('Supabase response:', { data, error: insertError });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      if (!data || !data.id) {
        console.error('No data returned from Supabase insert');
        throw new Error('No event ID returned from database');
      }

      const newEventId = data.id;
      console.log('New event ID:', newEventId);
      
      setEventId(newEventId);
      setRsvpLink(`https://daf-invite.app/rsvp/${newEventId}`);
      onEventSaved(newEventId);

      console.log('Event saved successfully:', newEventId);

    } catch (err) {
      console.error('Error saving event:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save event. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as any).message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (date: string, time: string) => {
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

  if (isSaving) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Saving Your Event</h3>
          <p className="text-gray-400">Creating your invitation and RSVP link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Error Saving Event</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={saveEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Event Created Successfully!</h3>
          <p className="text-gray-400">Your invitation is ready to share</p>
        </div>

        {/* Event Summary */}
        <div className="bg-gray-700/30 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Event Summary</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Title:</span> <span className="text-white ml-2">{eventData.title}</span></div>
            <div><span className="text-gray-400">Date:</span> <span className="text-white ml-2">{formatDate(eventData.eventDate, eventData.eventTime)}</span></div>
            <div><span className="text-gray-400">Location:</span> <span className="text-white ml-2">{eventData.location}</span></div>
            <div><span className="text-gray-400">Point of Contact:</span> <span className="text-white ml-2">{eventData.contactName}</span></div>
            <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{eventData.contactEmail}</span></div>
            <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-2">{eventData.contactPhone}</span></div>
          </div>
        </div>

        {/* RSVP Link */}
        <div className="bg-blue-900/30 rounded-lg p-6 mb-6 border border-blue-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Share Your Invitation</h4>
          <p className="text-gray-300 text-sm mb-4">
            Send this link to your guests. They can view the invitation and RSVP without creating an account.
          </p>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-800 rounded-lg p-3 border border-gray-600">
              <code className="text-blue-400 text-sm break-all">{rsvpLink}</code>
            </div>
            <button
              onClick={() => copyToClipboard(rsvpLink)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a
            href={rsvpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-sm font-medium">Preview Invitation</span>
          </a>

          <button
            onClick={() => copyToClipboard(rsvpLink)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Copy Link</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};