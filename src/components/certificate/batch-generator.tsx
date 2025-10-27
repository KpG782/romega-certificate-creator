// src/components/certificate/batch-generator.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  FileJson,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  BatchRecipient,
  BatchProgress,
  BATCH_JSON_EXAMPLE,
} from "@/types/batch";
import {
  BatchCertificateGenerator,
  parseRecipientsFile,
} from "@/lib/batch-generator";
import {
  TextElement,
  ImageElement,
  CertificateTemplate,
} from "@/types/certificates";

interface BatchGeneratorProps {
  template: CertificateTemplate | null;
  textElements: TextElement[];
  imageElements: ImageElement[];
}

export default function BatchGenerator({
  template,
  textElements,
  imageElements,
}: BatchGeneratorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recipients, setRecipients] = useState<BatchRecipient[]>([]);
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    current: 0,
    status: "idle",
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const parsedRecipients = await parseRecipientsFile(file);
      setRecipients(parsedRecipients);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
      setRecipients([]);
    }
  };

  const handleGenerate = async () => {
    if (!template || recipients.length === 0) return;

    setError(null);
    const generator = new BatchCertificateGenerator();

    try {
      await generator.generateBatch(
        recipients,
        template,
        textElements,
        imageElements,
        setProgress
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate certificates"
      );
      setProgress((prev) => ({ ...prev, status: "error" }));
    }
  };

  const downloadExample = () => {
    const blob = new Blob([JSON.stringify(BATCH_JSON_EXAMPLE, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "batch-example.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate =
    template && recipients.length > 0 && progress.status !== "processing";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Batch Certificate Generation
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Upload a JSON file with recipient data to generate multiple
          certificates at once
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        <h4
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
            color: "#1e40af",
          }}
        >
          📝 How to use:
        </h4>
        <ol
          style={{
            fontSize: "0.75rem",
            color: "#1e40af",
            marginLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <li>
            Add text with placeholders like{" "}
            <code
              style={{
                backgroundColor: "#dbeafe",
                padding: "0.125rem 0.25rem",
                borderRadius: "0.25rem",
              }}
            >
              {"{{name}}"}
            </code>
          </li>
          <li>Upload a JSON file with recipient data</li>
          <li>Click "Generate All Certificates"</li>
          <li>Download the ZIP file with all certificates</li>
        </ol>
      </div>

      {/* Example Download */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem",
          backgroundColor: "#f9fafb",
          borderRadius: "0.5rem",
        }}
      >
        <FileJson style={{ width: "20px", height: "20px", color: "#6b7280" }} />
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.125rem",
            }}
          >
            Need an example?
          </p>
          <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Download a sample JSON template
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadExample}>
          <Download
            style={{ width: "16px", height: "16px", marginRight: "0.5rem" }}
          />
          Example
        </Button>
      </div>

      {/* File Upload */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Upload Recipients JSON
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          style={{ width: "100%" }}
        >
          <Upload
            style={{ width: "16px", height: "16px", marginRight: "0.5rem" }}
          />
          Choose JSON File
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.75rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
          }}
        >
          <AlertCircle
            style={{
              width: "20px",
              height: "20px",
              color: "#dc2626",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#dc2626",
                marginBottom: "0.125rem",
              }}
            >
              Error
            </p>
            <p style={{ fontSize: "0.75rem", color: "#991b1b" }}>{error}</p>
          </div>
        </div>
      )}

      {/* Recipients Preview */}
      {recipients.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {recipients.length} Recipients Loaded
            </span>
            <CheckCircle2
              style={{ width: "18px", height: "18px", color: "#10b981" }}
            />
          </div>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              padding: "0.5rem",
            }}
          >
            {recipients.map((recipient, index) => (
              <div
                key={index}
                style={{
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  borderBottom:
                    index < recipients.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                }}
              >
                <span style={{ fontWeight: 600 }}>{recipient.name}</span>
                {recipient.title && (
                  <span style={{ color: "#6b7280", marginLeft: "0.5rem" }}>
                    • {recipient.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {progress.status === "processing" && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Generating certificates...
            </span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e5e7eb",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                height: "100%",
                backgroundColor: "#3b82f6",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          {progress.currentName && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              Processing: {progress.currentName}
            </p>
          )}
        </div>
      )}

      {/* Success Message */}
      {progress.status === "complete" && (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.75rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "0.5rem",
          }}
        >
          <CheckCircle2
            style={{
              width: "20px",
              height: "20px",
              color: "#16a34a",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#16a34a",
                marginBottom: "0.125rem",
              }}
            >
              Success!
            </p>
            <p style={{ fontSize: "0.75rem", color: "#15803d" }}>
              {progress.total} certificates generated and downloaded as ZIP
            </p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{ width: "100%" }}
        size="lg"
      >
        {progress.status === "processing" ? (
          <>
            <Loader2
              style={{
                width: "18px",
                height: "18px",
                marginRight: "0.5rem",
                animation: "spin 1s linear infinite",
              }}
            />
            Generating...
          </>
        ) : (
          <>
            <Download
              style={{ width: "18px", height: "18px", marginRight: "0.5rem" }}
            />
            Generate All Certificates
          </>
        )}
      </Button>

      {/* Placeholders Info */}
      <div
        style={{
          backgroundColor: "#fefce8",
          border: "1px solid #fde047",
          borderRadius: "0.5rem",
          padding: "0.75rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "#854d0e",
            marginBottom: "0.5rem",
          }}
        >
          <strong>📌 Available Placeholders:</strong>
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.5rem",
            fontSize: "0.75rem",
            color: "#854d0e",
          }}
        >
          <code
            style={{
              backgroundColor: "#fef9c3",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            {"{{name}}"}
          </code>
          <code
            style={{
              backgroundColor: "#fef9c3",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            {"{{title}}"}
          </code>
          <code
            style={{
              backgroundColor: "#fef9c3",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            {"{{date}}"}
          </code>
        </div>
      </div>
    </div>
  );
}
