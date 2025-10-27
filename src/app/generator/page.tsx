// src/app/generator/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";
import CertificateCanvas from "@/components/certificate/canvas";
import TextControls from "@/components/certificate/text-controls";
import ImageControls from "@/components/certificate/image-controls";
import TemplateSelector from "@/components/certificate/template-selector";
import {
  TextElement,
  ImageElement,
  CertificateTemplate,
} from "@/types/certificates";

function GeneratorContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<
    "text" | "image" | null
  >(null);

  const addTextElement = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: "New Text",
      position: { x: 100, y: 100 },
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
    };
    setTextElements([...textElements, newText]);
    setSelectedElement(newText.id);
    setSelectedElementType("text");
  };

  const addImageElement = (src: string) => {
    const newImage: ImageElement = {
      id: `image-${Date.now()}`,
      src,
      position: { x: 150, y: 150 },
      width: 150,
      height: 100,
      type: "signature",
    };
    setImageElements([...imageElements, newImage]);
    setSelectedElement(newImage.id);
    setSelectedElementType("image");
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const updateImageElement = (id: string, updates: Partial<ImageElement>) => {
    setImageElements(
      imageElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = () => {
    if (selectedElementType === "text") {
      setTextElements(textElements.filter((el) => el.id !== selectedElement));
    } else if (selectedElementType === "image") {
      setImageElements(imageElements.filter((el) => el.id !== selectedElement));
    }
    setSelectedElement(null);
    setSelectedElementType(null);
  };

  const selectedTextElement = textElements.find(
    (el) => el.id === selectedElement
  );
  const selectedImageElement = imageElements.find(
    (el) => el.id === selectedElement
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">Certificate Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name}
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - NEW LAYOUT: Canvas on top, controls below */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Canvas Section - Full Width on Top */}
        <div className="mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            {template ? (
              <CertificateCanvas
                template={template}
                textElements={textElements}
                imageElements={imageElements}
                selectedElement={selectedElement}
                onSelectElement={(id, type) => {
                  setSelectedElement(id);
                  setSelectedElementType(type);
                }}
                onUpdateTextElement={updateTextElement}
                onUpdateImageElement={updateImageElement}
              />
            ) : (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">
                    No template selected
                  </p>
                  <p className="text-gray-400 text-sm">
                    Select or upload a template below to start
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Section - Three Columns Below Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Template Selector */}
          <div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Template</h2>
              <TemplateSelector
                selectedTemplate={template}
                onSelectTemplate={setTemplate}
              />
            </div>
          </div>

          {/* Middle Column - Add Elements */}
          <div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Add Elements</h2>
              <div className="space-y-3">
                <Button
                  onClick={addTextElement}
                  className="w-full"
                  disabled={!template}
                >
                  + Add Text
                </Button>
                <ImageControls
                  onAddImage={addImageElement}
                  disabled={!template}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Element Properties */}
          <div>
            {selectedTextElement ? (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Text Properties</h2>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteElement}
                  >
                    Delete
                  </Button>
                </div>
                <TextControls
                  element={selectedTextElement}
                  onUpdate={(updates) =>
                    updateTextElement(selectedTextElement.id, updates)
                  }
                />
              </div>
            ) : selectedImageElement ? (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Image Properties</h2>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteElement}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Width
                    </label>
                    <input
                      type="number"
                      value={selectedImageElement.width}
                      onChange={(e) =>
                        updateImageElement(selectedImageElement.id, {
                          width: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Height
                    </label>
                    <input
                      type="number"
                      value={selectedImageElement.height}
                      onChange={(e) =>
                        updateImageElement(selectedImageElement.id, {
                          height: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Properties</h2>
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">
                    Select a text or image element to edit its properties
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <ProtectedRoute>
      <GeneratorContent />
    </ProtectedRoute>
  );
}
