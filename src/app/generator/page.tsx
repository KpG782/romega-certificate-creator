// src/app/generator/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";
import CertificateCanvas from "@/components/certificate/canvas";
import TextControls from "@/components/certificate/text-controls";
import BatchGenerator from "@/components/certificate/batch-generator";
import GeneratorTour from "@/components/onboarding/generator-tour";
import {
  TextElement,
  ImageElement,
  CertificateTemplate,
} from "@/types/certificates";
import {
  Plus,
  Image as ImageIcon,
  Upload,
  FileImage,
  LogOut,
  Layers,
  HelpCircle,
} from "lucide-react";

const CERTIFICATE_WIDTH = 1200;
const CERTIFICATE_HEIGHT = 850;

const DEFAULT_TEMPLATES: CertificateTemplate[] = [
  {
    id: "template-1",
    name: "Classic",
    backgroundImage: "/certificates/template1.png",
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
  },
  {
    id: "template-2",
    name: "Modern",
    backgroundImage: "/certificates/template2.png",
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
  },
];

function GeneratorContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<
    "text" | "image" | null
  >(null);
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has seen generator tour
    const hasSeenGeneratorTour = localStorage.getItem("hasSeenGeneratorTour");
    if (!hasSeenGeneratorTour) {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem("hasSeenGeneratorTour", "true");
  };

  const handleShowTour = () => {
    setShowTour(true);
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        addImageElement(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newTemplate: CertificateTemplate = {
          id: "custom-" + Date.now(),
          name: "Custom",
          backgroundImage: imageUrl,
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
        };
        setTemplate(newTemplate);
      };
      reader.readAsDataURL(file);
    }
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tour Overlay */}
      {showTour && <GeneratorTour onComplete={handleTourComplete} />}

      {/* Top Navigation Bar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            padding: "0.75rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Left: Back + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              ← Back
            </Button>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              Certificate Generator
            </h1>
          </div>

          {/* Center: Quick Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {/* Template Selection */}
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              data-tour="template-selector"
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#6b7280",
                }}
              >
                Template:
              </span>
              {DEFAULT_TEMPLATES.map((t) => (
                <Button
                  key={t.id}
                  variant={template?.id === t.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTemplate(t)}
                >
                  {t.name}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => templateInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Custom
              </Button>
              <input
                ref={templateInputRef}
                type="file"
                accept="image/*"
                onChange={handleTemplateUpload}
                style={{ display: "none" }}
              />
            </div>

            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#e5e7eb",
                margin: "0 0.5rem",
              }}
            />

            {/* Add Elements */}
            <Button
              size="sm"
              onClick={addTextElement}
              disabled={!template}
              data-tour="add-text-btn"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Text
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!template}
              data-tour="add-image-btn"
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Add Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Right: User + Logout */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowTour}
              style={{ color: "#3b82f6" }}
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Canvas Area - Left Side */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1.5rem",
          }}
          data-tour="canvas-area"
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              height: "100%",
            }}
          >
            {template ? (
              <div data-tour="download-btn">
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
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "500px",
                  border: "2px dashed #d1d5db",
                  borderRadius: "0.5rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <FileImage
                    style={{
                      width: "64px",
                      height: "64px",
                      margin: "0 auto 1rem",
                      color: "#9ca3af",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No template selected
                  </p>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#9ca3af",
                    }}
                  >
                    Select a template from the top bar to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel - Right Side */}
        <div
          style={{
            width: "380px",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          data-tour="properties-panel"
        >
          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <button
              onClick={() => setActiveTab("single")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                backgroundColor: activeTab === "single" ? "#ffffff" : "#f9fafb",
                color: activeTab === "single" ? "#1f2937" : "#6b7280",
                borderBottom:
                  activeTab === "single" ? "2px solid #3b82f6" : "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Single Certificate
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                backgroundColor: activeTab === "batch" ? "#ffffff" : "#f9fafb",
                color: activeTab === "batch" ? "#1f2937" : "#6b7280",
                borderBottom:
                  activeTab === "batch" ? "2px solid #3b82f6" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
              data-tour="batch-tab"
            >
              <Layers className="w-4 h-4" />
              Batch Generation
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "single" ? (
            <>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {selectedTextElement
                    ? "Text Properties"
                    : selectedImageElement
                    ? "Image Properties"
                    : "Properties"}
                </h2>
                {(selectedTextElement || selectedImageElement) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteElement}
                  >
                    Delete
                  </Button>
                )}
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.5rem",
                }}
              >
                {selectedTextElement ? (
                  <TextControls
                    element={selectedTextElement}
                    onUpdate={(updates) =>
                      updateTextElement(selectedTextElement.id, updates)
                    }
                  />
                ) : selectedImageElement ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={selectedImageElement.width}
                        onChange={(e) =>
                          updateImageElement(selectedImageElement.id, {
                            width: parseInt(e.target.value) || 100,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "2px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={selectedImageElement.height}
                        onChange={(e) =>
                          updateImageElement(selectedImageElement.id, {
                            height: parseInt(e.target.value) || 100,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "2px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        backgroundColor: "#eff6ff",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#1e40af",
                          margin: 0,
                        }}
                      >
                        💡 <strong>Tip:</strong> Use images with transparent
                        backgrounds (PNG) for best results
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 1rem",
                      color: "#9ca3af",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        margin: "0 auto 1rem",
                        borderRadius: "50%",
                        backgroundColor: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        marginBottom: "0.5rem",
                      }}
                    >
                      No element selected
                    </p>
                    <p style={{ fontSize: "0.75rem" }}>
                      Click on a text or image element in the canvas to edit its
                      properties
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
              }}
            >
              <BatchGenerator
                template={template}
                textElements={textElements}
                imageElements={imageElements}
              />
            </div>
          )}
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
