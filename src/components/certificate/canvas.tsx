// src/components/certificate/canvas.tsx (Fixed Centering)
"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CertificateTemplate,
  TextElement,
  ImageElement,
} from "@/types/certificates";

interface CertificateCanvasProps {
  template: CertificateTemplate;
  textElements: TextElement[];
  imageElements: ImageElement[];
  selectedElement: string | null;
  onSelectElement: (id: string, type: "text" | "image") => void;
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onUpdateImageElement: (id: string, updates: Partial<ImageElement>) => void;
}

function DraggableElement({
  id,
  position,
  onDrag,
  onSelect,
  isSelected,
  children,
}: {
  id: string;
  position: { x: number; y: number };
  onDrag: (x: number, y: number) => void;
  onSelect: () => void;
  isSelected: boolean;
  children: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onSelect();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onDrag(Math.max(0, newX), Math.max(0, newY));
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, onDrag]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: isSelected ? "2px" : "0",
      }}
    >
      {children}
    </div>
  );
}

export default function CertificateCanvas({
  template,
  textElements,
  imageElements,
  selectedElement,
  onSelectElement,
  onUpdateTextElement,
  onUpdateImageElement,
}: CertificateCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32;
        const scaleToFit = containerWidth / template.width;
        setScale(Math.min(scaleToFit, 1));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [template.width]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleDownload = async () => {
    if (!canvasRef.current) {
      alert("Canvas not ready");
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");

      canvas.width = template.width;
      canvas.height = template.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const templateImg = await loadImage(template.backgroundImage);
      ctx.drawImage(templateImg, 0, 0, template.width, template.height);

      for (const element of imageElements) {
        const img = await loadImage(element.src);
        ctx.drawImage(
          img,
          element.position.x,
          element.position.y,
          element.width,
          element.height
        );
      }

      // FIXED: Smart text rendering with proper maxWidth usage
      textElements.forEach((element) => {
        ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.textBaseline = "top";

        const lines = element.text.split("\n");

        lines.forEach((line, index) => {
          const y = element.position.y + index * element.fontSize * 1.2;
          const metrics = ctx.measureText(line);
          const textWidth = metrics.width;

          // FIXED: Use element.maxWidth if specified
          const maxWidth = element.maxWidth || template.width * 0.8;
          let x = element.position.x;

          if (element.textAlign === "center") {
            ctx.textAlign = "center";

            // Auto-scale if text exceeds maxWidth
            if (textWidth > maxWidth) {
              ctx.save();
              const scale = maxWidth / textWidth;
              ctx.translate(x, y);
              ctx.scale(scale, 1);
              ctx.fillText(line, 0, 0);
              ctx.restore();
            } else {
              ctx.fillText(line, x, y);
            }
          } else if (element.textAlign === "left") {
            ctx.textAlign = "left";
            ctx.fillText(line, x, y);
          } else if (element.textAlign === "right") {
            ctx.textAlign = "right";
            ctx.fillText(line, x, y);
          }
        });
      });

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `certificate-${Date.now()}.png`;
            link.href = url;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
          }
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Download error:", error);
      alert(
        `Failed to download: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Canvas</h2>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? "Generating..." : "Download Certificate"}
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={template.width}
        height={template.height}
      />

      <div
        ref={containerRef}
        style={{
          minHeight: "500px",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={displayRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onSelectElement("", "text");
            }
          }}
          style={{
            position: "relative",
            width: `${template.width}px`,
            height: `${template.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            backgroundColor: "#ffffff",
            backgroundImage: template.backgroundImage
              ? `url(${template.backgroundImage})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Render text elements with bounding box guides */}
          {textElements.map((element) => {
            const isSelected = selectedElement === element.id;
            const maxWidth = element.maxWidth || template.width * 0.8;
            const showBox =
              element.textAlign === "center" &&
              (isSelected || element.showBoundingBox);

            return (
              <div key={element.id}>
                {/* FIXED: Bounding box now properly centered */}
                {showBox && (
                  <div
                    style={{
                      position: "absolute",
                      // The box should be centered around position.x
                      left: `${element.position.x}px`,
                      top: `${element.position.y - 4}px`,
                      width: `${maxWidth}px`,
                      height: `${element.fontSize * 1.4}px`,
                      border: "2px dashed #93c5fd",
                      backgroundColor: "rgba(147, 197, 253, 0.1)",
                      borderRadius: "4px",
                      pointerEvents: "none",
                      zIndex: 1,
                      // Center the box itself
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "10px",
                        color: "#3b82f6",
                        backgroundColor: "white",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        border: "1px solid #93c5fd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Text Area: {maxWidth}px
                    </div>
                  </div>
                )}

                {/* Actual draggable text element */}
                <DraggableElement
                  id={element.id}
                  position={element.position}
                  onDrag={(x, y) =>
                    onUpdateTextElement(element.id, { position: { x, y } })
                  }
                  onSelect={() => onSelectElement(element.id, "text")}
                  isSelected={isSelected}
                >
                  <div
                    style={{
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                      color: element.color,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                      textAlign: element.textAlign,
                      userSelect: "none",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.2",
                      position: "relative",
                      zIndex: 2,
                      // Visual centering for centered text
                      ...(element.textAlign === "center" && {
                        transform: "translateX(-50%)",
                      }),
                    }}
                  >
                    {element.text}
                  </div>
                </DraggableElement>

                {/* Center point indicator */}
                {isSelected && element.textAlign === "center" && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${element.position.x - 1}px`,
                      top: `${element.position.y}px`,
                      width: "2px",
                      height: `${element.fontSize * 1.2}px`,
                      backgroundColor: "#3b82f6",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Image elements */}
          {imageElements.map((element) => (
            <DraggableElement
              key={element.id}
              id={element.id}
              position={element.position}
              onDrag={(x, y) =>
                onUpdateImageElement(element.id, { position: { x, y } })
              }
              onSelect={() => onSelectElement(element.id, "image")}
              isSelected={selectedElement === element.id}
            >
              <img
                src={element.src}
                alt={element.type}
                draggable={false}
                style={{
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </DraggableElement>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "#6b7280",
        }}
      >
        <span>Click and drag elements to reposition</span>
        <span>Scale: {Math.round(scale * 100)}%</span>
      </div>

      <div
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "0.5rem",
          padding: "0.75rem",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "#1e40af", margin: 0 }}>
          <strong>💡 Tips:</strong> Blue dashed box shows text centering area •
          Blue line shows center point • Drag to reposition • Text will
          auto-center and auto-scale within the box
        </p>
      </div>
    </div>
  );
}
