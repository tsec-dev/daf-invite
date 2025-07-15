import React, { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';
import { EventData, DesignData, DesignElement } from './EventWizard';

interface AdvancedInvitationDesignerProps {
  eventData: EventData;
  designData: DesignData;
  onDesignChange: (data: DesignData) => void;
}

export const AdvancedInvitationDesigner: React.FC<AdvancedInvitationDesignerProps> = ({
  eventData,
  designData,
  onDesignChange
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'background' | 'elements' | 'border'>('background');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Initialize default draggable elements if empty
  React.useEffect(() => {
    if (designData.elements.length === 0) {
      const defaultElements: DesignElement[] = [
        {
          id: 'title',
          type: 'text',
          content: eventData.title || 'EVENT TITLE',
          position: { x: 50, y: 5 },
          size: { width: 350, height: 50 },
          style: {
            fontSize: 28,
            fontFamily: 'Georgia',
            color: '#1e293b',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 10
        },
        {
          id: 'description',
          type: 'text',
          content: eventData.description || 'Event Description',
          position: { x: 50, y: 15 },
          size: { width: 320, height: 40 },
          style: {
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#475569',
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 9
        },
        {
          id: 'datetime',
          type: 'text',
          content: formatDate(eventData.eventDate, eventData.eventTime),
          position: { x: 50, y: 25 },
          size: { width: 300, height: 30 },
          style: {
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#1e293b',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 8
        },
        {
          id: 'location',
          type: 'text',
          content: eventData.location || 'Event Location',
          position: { x: 50, y: 35 },
          size: { width: 280, height: 25 },
          style: {
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#1e293b',
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 7
        },
        {
          id: 'dresscode',
          type: 'text',
          content: eventData.dresscode ? `Dress Code: ${eventData.dresscode}` : '',
          position: { x: 50, y: 45 },
          size: { width: 250, height: 25 },
          style: {
            fontSize: 13,
            fontFamily: 'Arial',
            color: '#64748b',
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 6
        },
        {
          id: 'notes',
          type: 'text',
          content: eventData.notes || '',
          position: { x: 50, y: 55 },
          size: { width: 320, height: 40 },
          style: {
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#64748b',
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 5
        },
        {
          id: 'contact',
          type: 'text',
          content: `POC: ${eventData.contactName || 'Contact Name'}\n${eventData.contactEmail || 'email@mail.mil'}\n${eventData.contactPhone || '(555) 123-4567'}`,
          position: { x: 50, y: 75 },
          size: { width: 280, height: 60 },
          style: {
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#475569',
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 4
        }
      ];
      
      // Also update background to white
      onDesignChange({
        ...designData,
        elements: defaultElements,
        background: {
          type: 'solid',
          value: '#ffffff',
          gradientDirection: 135,
          gradientColors: ['#ffffff', '#ffffff']
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update elements when event data changes
  React.useEffect(() => {
    if (designData.elements.length > 0) {
      const hasChanges = designData.elements.some(element => {
        if (element.id === 'title') {
          return element.content !== (eventData.title || 'EVENT TITLE');
        }
        if (element.id === 'description') {
          return element.content !== (eventData.description || 'Event Description');
        }
        if (element.id === 'datetime') {
          return element.content !== formatDate(eventData.eventDate, eventData.eventTime);
        }
        if (element.id === 'location') {
          return element.content !== (eventData.location || 'Event Location');
        }
        if (element.id === 'dresscode') {
          const dresscodeContent = eventData.dresscode ? `Dress Code: ${eventData.dresscode}` : '';
          return element.content !== dresscodeContent;
        }
        if (element.id === 'notes') {
          return element.content !== (eventData.notes || '');
        }
        if (element.id === 'contact') {
          const newContent = `POC: ${eventData.contactName || 'Contact Name'}\n${eventData.contactEmail || 'email@mail.mil'}\n${eventData.contactPhone || '(555) 123-4567'}`;
          return element.content !== newContent;
        }
        return false;
      });
      
      if (hasChanges) {
        const updatedElements = designData.elements.map(element => {
          if (element.id === 'title') {
            return { ...element, content: eventData.title || 'EVENT TITLE' };
          }
          if (element.id === 'description') {
            return { ...element, content: eventData.description || 'Event Description' };
          }
          if (element.id === 'datetime') {
            return { ...element, content: formatDate(eventData.eventDate, eventData.eventTime) };
          }
          if (element.id === 'location') {
            return { ...element, content: eventData.location || 'Event Location' };
          }
          if (element.id === 'dresscode') {
            return { ...element, content: eventData.dresscode ? `Dress Code: ${eventData.dresscode}` : '' };
          }
          if (element.id === 'notes') {
            return { ...element, content: eventData.notes || '' };
          }
          if (element.id === 'contact') {
            return { 
              ...element, 
              content: `POC: ${eventData.contactName || 'Contact Name'}\n${eventData.contactEmail || 'email@mail.mil'}\n${eventData.contactPhone || '(555) 123-4567'}`
            };
          }
          return element;
        });
        
        onDesignChange({
          ...designData,
          elements: updatedElements
        });
      }
    }
  }, [eventData.title, eventData.description, eventData.eventDate, eventData.eventTime, eventData.location, eventData.dresscode, eventData.notes, eventData.contactName, eventData.contactEmail, eventData.contactPhone, designData.elements, onDesignChange]);

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

  // Font options
  const fonts = [
    'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Helvetica',
    'Playfair Display', 'Merriweather', 'Open Sans', 'Roboto', 'Lato'
  ];

  // Handle image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newElement: DesignElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: reader.result as string,
          position: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          style: {
            borderRadius: 0,
            padding: 0
          },
          zIndex: designData.elements.length + 1
        };
        
        onDesignChange({
          ...designData,
          elements: [...designData.elements, newElement]
        });
      };
      reader.readAsDataURL(file);
    });
  }, [designData, onDesignChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    multiple: true
  });

  // Handle background image upload
  const onBackgroundDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onDesignChange({
          ...designData,
          background: {
            ...designData.background,
            type: 'image',
            value: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }, [designData, onDesignChange]);

  const { getRootProps: getBackgroundRootProps, getInputProps: getBackgroundInputProps, isDragActive: isBackgroundDragActive } = useDropzone({
    onDrop: onBackgroundDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    multiple: false
  });

  // Add text element
  const addTextElement = () => {
    const newElement: DesignElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      style: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: designData.customColors.primary,
        fontWeight: 'normal',
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 8
      },
      zIndex: designData.elements.length + 1
    };
    
    onDesignChange({
      ...designData,
      elements: [...designData.elements, newElement]
    });
  };

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    const updatedElements = designData.elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    onDesignChange({ ...designData, elements: updatedElements });
  }, [designData.elements, onDesignChange]);

  // Delete element
  const deleteElement = (id: string) => {
    const updatedElements = designData.elements.filter(el => el.id !== id);
    onDesignChange({ ...designData, elements: updatedElements });
    setSelectedElement(null);
  };

  // Generate background CSS
  const generateBackgroundCSS = () => {
    if (designData.background.type === 'gradient' && designData.background.gradientColors) {
      const colors = designData.background.gradientColors.join(', ');
      return `linear-gradient(${designData.background.gradientDirection}deg, ${colors})`;
    } else if (designData.background.type === 'image' && designData.background.value.startsWith('data:')) {
      return `url(${designData.background.value}) center/cover no-repeat`;
    }
    return designData.background.value;
  };

  // Element drag handlers
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the canvas element
    let canvas = e.currentTarget.parentElement;
    while (canvas && !canvas.hasAttribute('data-canvas')) {
      canvas = canvas.parentElement;
    }
    
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const element = designData.elements.find(el => el.id === elementId);
    
    if (element) {
      // Calculate offset from mouse to element position
      const elementX = (element.position.x / 100) * rect.width;
      const elementY = (element.position.y / 100) * rect.height;
      
      setDragOffset({
        x: e.clientX - rect.left - elementX,
        y: e.clientY - rect.top - elementY
      });
      
      setDraggedElement(elementId);
      setSelectedElement(elementId);
      
      // Add dragging class to body to prevent text selection
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';
    }
  };

  // Global mouse move handler
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedElement) return;
    
    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    updateElement(draggedElement, {
      position: { 
        x: Math.max(0, Math.min(85, x)), 
        y: Math.max(0, Math.min(85, y)) 
      }
    });
  }, [draggedElement, dragOffset.x, dragOffset.y, updateElement]);

  // Global mouse up handler
  const handleGlobalMouseUp = useCallback(() => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Reset body styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Set up global mouse events
  React.useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggedElement, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  // Center all elements horizontally
  const centerAllElements = () => {
    const updatedElements = designData.elements.map(element => ({
      ...element,
      position: { x: 50, y: element.position.y },
      // Also set text alignment to center when centering elements
      style: { ...element.style, textAlign: 'center' as const }
    }));
    onDesignChange({ ...designData, elements: updatedElements });
  };

  // Snap elements to fit within canvas bounds
  const snapToFit = () => {
    const updatedElements = designData.elements.map(element => {
      const maxX = 85; // Leave some margin
      const maxY = 85;
      return {
        ...element,
        position: {
          x: Math.max(5, Math.min(maxX, element.position.x)),
          y: Math.max(5, Math.min(maxY, element.position.y))
        }
      };
    });
    onDesignChange({ ...designData, elements: updatedElements });
  };

  // Generate border CSS with two colors for dashed/dotted styles
  const generateBorderCSS = (): string => {
    if (!designData.border.enabled) return 'none';
    
    const { width, style, color, secondaryColor } = designData.border;
    
    // For dashed/dotted borders with secondary color, create a custom pattern
    if ((style === 'dashed' || style === 'dotted') && secondaryColor) {
      // For now, just use the primary color - we'll implement two-color borders with CSS pseudo-elements later
      return `${width}px ${style} ${color}`;
    }
    
    // Standard single-color border
    return `${width}px ${style} ${color}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Design Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {['background', 'elements', 'border'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          {activeTab === 'background' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Background</h4>
              
              {/* Background Type */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Type</label>
                <select
                  value={designData.background.type}
                  onChange={(e) => onDesignChange({
                    ...designData,
                    background: { ...designData.background, type: e.target.value as any }
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>

              {/* Solid Color Controls */}
              {designData.background.type === 'solid' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Color</label>
                  <button
                    onClick={() => setShowColorPicker('background-solid')}
                    className="w-full h-12 rounded border-2 border-gray-600"
                    style={{ backgroundColor: designData.background.value }}
                  />
                </div>
              )}

              {/* Gradient Controls */}
              {designData.background.type === 'gradient' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Direction</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={designData.background.gradientDirection || 135}
                      onChange={(e) => onDesignChange({
                        ...designData,
                        background: {
                          ...designData.background,
                          gradientDirection: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{designData.background.gradientDirection}°</span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Colors</label>
                    <div className="space-y-2">
                      {(designData.background.gradientColors || []).map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowColorPicker(`gradient-${index}`)}
                            className="w-8 h-8 rounded border-2 border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(designData.background.gradientColors || [])];
                              newColors[index] = e.target.value;
                              onDesignChange({
                                ...designData,
                                background: { ...designData.background, gradientColors: newColors }
                              });
                            }}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newColors = [...(designData.background.gradientColors || []), '#ffffff'];
                          onDesignChange({
                            ...designData,
                            background: { ...designData.background, gradientColors: newColors }
                          });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Image Background Controls */}
              {designData.background.type === 'image' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Background Image</label>
                  {designData.background.value && designData.background.value.startsWith('data:') ? (
                    <div className="space-y-2">
                      <div className="relative w-full h-32 rounded overflow-hidden">
                        <img 
                          src={designData.background.value} 
                          alt="Background" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onDesignChange({
                            ...designData,
                            background: { ...designData.background, value: '#ffffff' }
                          })}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      {...getBackgroundRootProps()} 
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isBackgroundDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input {...getBackgroundInputProps()} />
                      <p className="text-sm text-gray-400">
                        {isBackgroundDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Elements</h4>
              
              {/* Add Elements */}
              <div className="space-y-2">
                <button
                  onClick={addTextElement}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium"
                >
                  + Add Text Element
                </button>
                
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                }`}>
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-400">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images or click'}
                  </p>
                </div>
              </div>

              {/* Layout Tools */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Layout Tools</h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={centerAllElements}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-xs font-medium"
                  >
                    Center All
                  </button>
                  <button
                    onClick={snapToFit}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-xs font-medium"
                  >
                    Snap to Fit
                  </button>
                </div>
              </div>

              {/* Element List */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Current Elements</h5>
                {designData.elements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-2 rounded border cursor-pointer ${
                      selectedElement === element.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">
                        {element.type === 'text' ? element.content : `Image ${element.id}`}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Element Properties */}
              {selectedElement && (
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  {(() => {
                    const element = designData.elements.find(el => el.id === selectedElement);
                    if (!element) return null;

                    return (
                      <>
                        <h5 className="text-sm font-medium text-gray-300">Element Properties</h5>
                        
                        {element.type === 'text' && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Text</label>
                              <textarea
                                value={element.content || ''}
                                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm resize-none"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Font</label>
                              <select
                                value={element.style.fontFamily}
                                onChange={(e) => updateElement(element.id, {
                                  style: { ...element.style, fontFamily: e.target.value }
                                })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                              >
                                {fonts.map(font => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Size</label>
                              <input
                                type="range"
                                min="8"
                                max="72"
                                value={element.style.fontSize || 16}
                                onChange={(e) => updateElement(element.id, {
                                  style: { ...element.style, fontSize: parseInt(e.target.value) }
                                })}
                                className="w-full"
                              />
                              <span className="text-xs text-gray-400">{element.style.fontSize}px</span>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Font Weight</label>
                              <select
                                value={element.style.fontWeight}
                                onChange={(e) => updateElement(element.id, {
                                  style: { ...element.style, fontWeight: e.target.value }
                                })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                              >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="600">Semi-bold</option>
                                <option value="300">Light</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Text Align</label>
                              <select
                                value={element.style.textAlign}
                                onChange={(e) => updateElement(element.id, {
                                  style: { ...element.style, textAlign: e.target.value as 'left' | 'center' | 'right' }
                                })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Color</label>
                              <button
                                onClick={() => setShowColorPicker(`element-${element.id}-color`)}
                                className="w-full h-8 rounded border-2 border-gray-600"
                                style={{ backgroundColor: element.style.color }}
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                              <button
                                onClick={() => setShowColorPicker(`element-${element.id}-bg`)}
                                className="w-full h-8 rounded border-2 border-gray-600"
                                style={{ backgroundColor: element.style.backgroundColor }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Width</label>
                                <input
                                  type="range"
                                  min="50"
                                  max="400"
                                  value={element.size.width}
                                  onChange={(e) => updateElement(element.id, {
                                    size: { ...element.size, width: parseInt(e.target.value) }
                                  })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{element.size.width}px</span>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Height</label>
                                <input
                                  type="range"
                                  min="20"
                                  max="200"
                                  value={element.size.height}
                                  onChange={(e) => updateElement(element.id, {
                                    size: { ...element.size, height: parseInt(e.target.value) }
                                  })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{element.size.height}px</span>
                              </div>
                            </div>
                          </>
                        )}

                        {element.type === 'image' && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Width</label>
                                <input
                                  type="range"
                                  min="50"
                                  max="300"
                                  value={element.size.width}
                                  onChange={(e) => updateElement(element.id, {
                                    size: { ...element.size, width: parseInt(e.target.value) }
                                  })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{element.size.width}px</span>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Height</label>
                                <input
                                  type="range"
                                  min="50"
                                  max="300"
                                  value={element.size.height}
                                  onChange={(e) => updateElement(element.id, {
                                    size: { ...element.size, height: parseInt(e.target.value) }
                                  })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{element.size.height}px</span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                value={element.style.borderRadius || 0}
                                onChange={(e) => updateElement(element.id, {
                                  style: { ...element.style, borderRadius: parseInt(e.target.value) }
                                })}
                                className="w-full"
                              />
                              <span className="text-xs text-gray-400">{element.style.borderRadius || 0}px</span>
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}


          {activeTab === 'border' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Border</h4>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={designData.border.enabled}
                    onChange={(e) => onDesignChange({
                      ...designData,
                      border: { 
                        ...designData.border, 
                        enabled: e.target.checked,
                        // Preserve secondary color if it exists
                        secondaryColor: designData.border.secondaryColor
                      }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Enable Border</span>
                </label>
              </div>

              {designData.border.enabled && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Width</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={designData.border.width}
                      onChange={(e) => onDesignChange({
                        ...designData,
                        border: { 
                          ...designData.border, 
                          width: parseInt(e.target.value),
                          // Preserve secondary color if it exists
                          secondaryColor: designData.border.secondaryColor
                        }
                      })}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{designData.border.width}px</span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Primary Color</label>
                    <button
                      onClick={() => setShowColorPicker('border-color')}
                      className="w-full h-8 rounded border-2 border-gray-600"
                      style={{ backgroundColor: designData.border.color }}
                    />
                  </div>

                  {(designData.border.style === 'dashed' || designData.border.style === 'dotted') && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Secondary Color (Fill)</label>
                      <button
                        onClick={() => setShowColorPicker('border-secondary-color')}
                        className="w-full h-8 rounded border-2 border-gray-600"
                        style={{ backgroundColor: designData.border.secondaryColor || '#ffffff' }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Style</label>
                    <select
                      value={designData.border.style}
                      onChange={(e) => onDesignChange({
                        ...designData,
                        border: { 
                          ...designData.border, 
                          style: e.target.value as any,
                          // Preserve secondary color if it exists
                          secondaryColor: designData.border.secondaryColor
                        }
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900 rounded-lg p-4">
          <div
            data-canvas="true"
            className="w-full aspect-[3/4] relative rounded-lg overflow-hidden cursor-pointer"
            style={{
              background: generateBackgroundCSS(),
              border: generateBorderCSS(),
              // Two-color dashed border using box-shadow
              ...(designData.border.enabled && 
                  (designData.border.style === 'dashed' || designData.border.style === 'dotted') && 
                  designData.border.secondaryColor ? {
                    borderImage: `repeating-linear-gradient(45deg, ${designData.border.color} 0px, ${designData.border.color} 10px, ${designData.border.secondaryColor} 10px, ${designData.border.secondaryColor} 20px) 1`,
                    borderImageSlice: 1
                  } : {})
            }}
            onClick={handleCanvasClick}
          >
            {/* Decorative Corner Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2" style={{ borderColor: designData.customColors.secondary + '80' }}></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2" style={{ borderColor: designData.customColors.secondary + '80' }}></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2" style={{ borderColor: designData.customColors.secondary + '80' }}></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2" style={{ borderColor: designData.customColors.secondary + '80' }}></div>
            </div>

            {/* Custom Elements (overlay on top) */}
            {designData.elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move hover:opacity-80 transition-opacity ${
                  selectedElement === element.id ? 'ring-2 ring-blue-500 ring-opacity-50' : 'hover:ring-1 hover:ring-gray-400'
                } ${draggedElement === element.id ? 'shadow-lg scale-105' : ''}`}
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  width: `${element.size.width}px`,
                  height: `${element.size.height}px`,
                  zIndex: element.zIndex + 20,
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element.id)}
              >
                {element.type === 'text' && (
                  <div
                    style={{
                      fontSize: `${element.style.fontSize}px`,
                      fontFamily: element.style.fontFamily,
                      color: element.style.color,
                      fontWeight: element.style.fontWeight,
                      backgroundColor: element.style.backgroundColor,
                      borderRadius: `${element.style.borderRadius}px`,
                      padding: `${element.style.padding}px`,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: element.style.textAlign === 'center' ? 'center' : 
                                     element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
                      textAlign: element.style.textAlign,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {element.content}
                  </div>
                )}
                
                {element.type === 'image' && (
                  <img
                    src={element.src}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: `${element.style.borderRadius}px`
                    }}
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <HexColorPicker
              color={(() => {
                if (showColorPicker.startsWith('gradient-')) {
                  const index = parseInt(showColorPicker.split('-')[1]);
                  return designData.background.gradientColors?.[index] || '#ffffff';
                }
                if (showColorPicker.startsWith('custom-')) {
                  const key = showColorPicker.split('-')[1];
                  return designData.customColors[key as keyof typeof designData.customColors];
                }
                if (showColorPicker === 'border-color') {
                  return designData.border.color;
                }
                if (showColorPicker === 'border-secondary-color') {
                  return designData.border.secondaryColor || '#ffffff';
                }
                if (showColorPicker === 'background-solid') {
                  return designData.background.value;
                }
                if (showColorPicker.startsWith('element-')) {
                  const parts = showColorPicker.split('-');
                  const elementId = parts[1];
                  const colorType = parts[2]; // 'color' or 'bg'
                  const element = designData.elements.find(el => el.id === elementId);
                  if (colorType === 'bg') {
                    return element?.style.backgroundColor || '#ffffff';
                  }
                  return element?.style.color || '#ffffff';
                }
                return '#ffffff';
              })()}
              onChange={(color) => {
                if (showColorPicker.startsWith('gradient-')) {
                  const index = parseInt(showColorPicker.split('-')[1]);
                  const newColors = [...(designData.background.gradientColors || [])];
                  newColors[index] = color;
                  onDesignChange({
                    ...designData,
                    background: { ...designData.background, gradientColors: newColors }
                  });
                } else if (showColorPicker.startsWith('custom-')) {
                  const key = showColorPicker.split('-')[1];
                  onDesignChange({
                    ...designData,
                    customColors: { ...designData.customColors, [key]: color }
                  });
                } else if (showColorPicker === 'border-color') {
                  onDesignChange({
                    ...designData,
                    border: { 
                      ...designData.border, 
                      color,
                      // Preserve secondary color
                      secondaryColor: designData.border.secondaryColor
                    }
                  });
                } else if (showColorPicker === 'border-secondary-color') {
                  onDesignChange({
                    ...designData,
                    border: { 
                      ...designData.border, 
                      secondaryColor: color,
                      // Preserve primary color
                      color: designData.border.color
                    }
                  });
                } else if (showColorPicker === 'background-solid') {
                  onDesignChange({
                    ...designData,
                    background: { ...designData.background, value: color }
                  });
                } else if (showColorPicker.startsWith('element-')) {
                  const parts = showColorPicker.split('-');
                  const elementId = parts[1];
                  const colorType = parts[2]; // 'color' or 'bg'
                  const element = designData.elements.find(el => el.id === elementId);
                  if (element) {
                    if (colorType === 'bg') {
                      updateElement(elementId, {
                        style: { ...element.style, backgroundColor: color }
                      });
                    } else {
                      updateElement(elementId, {
                        style: { ...element.style, color }
                      });
                    }
                  }
                }
              }}
            />
            <button
              onClick={() => setShowColorPicker(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};