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
  const [activeTab, setActiveTab] = useState<'background' | 'elements' | 'colors' | 'border'>('background');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

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

  // Add text element
  const addTextElement = () => {
    const newElement: DesignElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      position: { x: 100, y: 100 },
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
  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    const updatedElements = designData.elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    onDesignChange({ ...designData, elements: updatedElements });
  };

  // Delete element
  const deleteElement = (id: string) => {
    const updatedElements = designData.elements.filter(el => el.id !== id);
    onDesignChange({ ...designData, elements: updatedElements });
    setSelectedElement(null);
  };

  // Generate gradient CSS
  const generateGradientCSS = () => {
    if (designData.background.type === 'gradient' && designData.background.gradientColors) {
      const colors = designData.background.gradientColors.join(', ');
      return `linear-gradient(${designData.background.gradientDirection}deg, ${colors})`;
    }
    return designData.background.value;
  };

  // Element drag handlers
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDraggedElement(elementId);
    setSelectedElement(elementId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement) return;
    
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    updateElement(draggedElement, {
      position: { x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) }
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggedElement(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Design Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {['background', 'elements', 'colors', 'border'].map((tab) => (
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
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Elements</h4>
              
              {/* Add Elements */}
              <div className="space-y-2">
                <button
                  onClick={addTextElement}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                >
                  + Add Text
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
                              <input
                                type="text"
                                value={element.content || ''}
                                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
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
                              <label className="block text-xs text-gray-400 mb-1">Color</label>
                              <button
                                onClick={() => setShowColorPicker(`element-${element.id}-color`)}
                                className="w-full h-8 rounded border-2 border-gray-600"
                                style={{ backgroundColor: element.style.color }}
                              />
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

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Custom Colors</h4>
              
              {Object.entries(designData.customColors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-300 mb-2 capitalize">{key}</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowColorPicker(`custom-${key}`)}
                      className="w-8 h-8 rounded border-2 border-gray-600"
                      style={{ backgroundColor: value }}
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onDesignChange({
                        ...designData,
                        customColors: { ...designData.customColors, [key]: e.target.value }
                      })}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
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
                      border: { ...designData.border, enabled: e.target.checked }
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
                        border: { ...designData.border, width: parseInt(e.target.value) }
                      })}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{designData.border.width}px</span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Color</label>
                    <button
                      onClick={() => setShowColorPicker('border-color')}
                      className="w-full h-8 rounded border-2 border-gray-600"
                      style={{ backgroundColor: designData.border.color }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Style</label>
                    <select
                      value={designData.border.style}
                      onChange={(e) => onDesignChange({
                        ...designData,
                        border: { ...designData.border, style: e.target.value as any }
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
        <h4 className="text-lg font-semibold text-white mb-4">Canvas</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <div
            className="w-full aspect-[3/4] relative rounded-lg overflow-hidden cursor-pointer"
            style={{
              background: generateGradientCSS(),
              border: designData.border.enabled 
                ? `${designData.border.width}px ${designData.border.style} ${designData.border.color}`
                : 'none'
            }}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Default Event Content (behind custom elements) */}
            <div className="absolute inset-0 p-6 text-white">
              {/* Decorative Corner Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/30"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/30"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/30"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/30"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between text-center">
                {/* Header Section */}
                <div>
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                      <h1 className="text-lg font-bold uppercase tracking-wider">
                        {eventData.title || 'EVENT TITLE'}
                      </h1>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded p-3 border border-white/20">
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-white/90">DATE & TIME</p>
                        <p className="text-white/80">
                          {formatDate(eventData.eventDate, eventData.eventTime) || 'Event Date & Time'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">LOCATION</p>
                        <p className="text-white/80">
                          {eventData.location || 'Event Location'}
                        </p>
                      </div>
                      {eventData.dresscode && (
                        <div>
                          <p className="font-semibold text-white/90">DRESS CODE</p>
                          <p className="text-white/80">{eventData.dresscode}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {eventData.description && (
                    <div className="text-xs text-white/70 leading-relaxed">
                      {eventData.description.length > 80 
                        ? eventData.description.substring(0, 80) + '...'
                        : eventData.description
                      }
                    </div>
                  )}
                </div>

                {/* Footer - Point of Contact */}
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs font-semibold text-white/90 mb-1">POINT OF CONTACT</p>
                  <div className="text-xs text-white/80 space-y-0.5">
                    <p>{eventData.contactName || 'Contact Name'}</p>
                    <p>{eventData.contactEmail || 'contact@mail.mil'}</p>
                    <p>{eventData.contactPhone || '(555) 123-4567'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Elements (overlay on top) */}
            {designData.elements.map((element) => (
              <div
                key={element.id}
                className="absolute cursor-move"
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  width: `${element.size.width}px`,
                  height: `${element.size.height}px`,
                  zIndex: element.zIndex + 20,
                  border: selectedElement === element.id ? '2px solid #3b82f6' : 'none'
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
                      textAlign: element.style.textAlign,
                      backgroundColor: element.style.backgroundColor,
                      borderRadius: `${element.style.borderRadius}px`,
                      padding: `${element.style.padding}px`,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: element.style.textAlign === 'center' ? 'center' : 
                                     element.style.textAlign === 'right' ? 'flex-end' : 'flex-start'
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
                if (showColorPicker.startsWith('element-')) {
                  const elementId = showColorPicker.split('-')[1];
                  const element = designData.elements.find(el => el.id === elementId);
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
                    border: { ...designData.border, color }
                  });
                } else if (showColorPicker.startsWith('element-')) {
                  const elementId = showColorPicker.split('-')[1];
                  updateElement(elementId, {
                    style: { ...designData.elements.find(el => el.id === elementId)?.style, color }
                  });
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