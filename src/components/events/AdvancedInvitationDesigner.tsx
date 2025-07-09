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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Initialize default draggable elements if empty
  React.useEffect(() => {
    if (designData.elements.length === 0) {
      const defaultElements: DesignElement[] = [
        {
          id: 'title',
          type: 'text',
          content: eventData.title || 'EVENT TITLE',
          position: { x: 50, y: 15 },
          size: { width: 300, height: 40 },
          style: {
            fontSize: 20,
            fontFamily: 'Arial',
            color: designData.customColors.primary,
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 10
        },
        {
          id: 'contact',
          type: 'text',
          content: `${eventData.contactName || 'Contact Name'}\n${eventData.contactEmail || 'email@mail.mil'}\n${eventData.contactPhone || '(555) 123-4567'}`,
          position: { x: 50, y: 75 },
          size: { width: 250, height: 60 },
          style: {
            fontSize: 12,
            fontFamily: 'Arial',
            color: designData.customColors.secondary,
            fontWeight: 'normal',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 8
          },
          zIndex: 9
        }
      ];
      
      onDesignChange({
        ...designData,
        elements: defaultElements
      });
    }
  }, []);
  
  // Update elements when event data changes
  React.useEffect(() => {
    if (designData.elements.length > 0) {
      const updatedElements = designData.elements.map(element => {
        if (element.id === 'title') {
          return { ...element, content: eventData.title || 'EVENT TITLE' };
        }
        if (element.id === 'contact') {
          return { 
            ...element, 
            content: `${eventData.contactName || 'Contact Name'}\n${eventData.contactEmail || 'email@mail.mil'}\n${eventData.contactPhone || '(555) 123-4567'}`
          };
        }
        return element;
      });
      
      onDesignChange({
        ...designData,
        elements: updatedElements
      });
    }
  }, [eventData.title, eventData.contactName, eventData.contactEmail, eventData.contactPhone]);

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
  const handleGlobalMouseMove = (e: MouseEvent) => {
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
  };

  // Global mouse up handler
  const handleGlobalMouseUp = () => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Reset body styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

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
  }, [draggedElement, dragOffset]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
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
            data-canvas="true"
            className="w-full aspect-[3/4] relative rounded-lg overflow-hidden cursor-pointer"
            style={{
              background: generateGradientCSS(),
              border: designData.border.enabled 
                ? `${designData.border.width}px ${designData.border.style} ${designData.border.color}`
                : 'none'
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
                      textAlign: element.style.textAlign,
                      backgroundColor: element.style.backgroundColor,
                      borderRadius: `${element.style.borderRadius}px`,
                      padding: `${element.style.padding}px`,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: element.style.textAlign === 'center' ? 'center' : 
                                     element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
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
                    border: { ...designData.border, color }
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