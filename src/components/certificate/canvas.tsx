// src/components/certificate/canvas.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CertificateTemplate,
  TextElement,
  ImageElement,
} from "@/types/certificates";
import html2canvas from "html2canvas";

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleDownload = async () => {
    if (!canvasRef.current) {
      alert("Canvas not ready");
      return;
    }

    const previousSelection = selectedElement;
    onSelectElement("", "text");
    setIsDownloading(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: template.width,
        height: template.height,
        windowWidth: template.width,
        windowHeight: template.height,
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
      setTimeout(() => {
        if (previousSelection) {
          onSelectElement(previousSelection, "text");
        }
      }, 300);
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
          ref={canvasRef}
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
          {textElements.map((element) => (
            <DraggableElement
              key={element.id}
              id={element.id}
              position={element.position}
              onDrag={(x, y) =>
                onUpdateTextElement(element.id, { position: { x, y } })
              }
              onSelect={() => onSelectElement(element.id, "text")}
              isSelected={selectedElement === element.id}
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
                  padding: "4px",
                }}
              >
                {element.text}
              </div>
            </DraggableElement>
          ))}

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
          <strong>💡 Tips:</strong> Click and hold to drag • Click element to
          edit • Click empty space to deselect • Download saves all changes
        </p>
      </div>
    </div>
  );
}
