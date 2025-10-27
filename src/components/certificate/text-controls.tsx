// src/components/certificate/text-controls.tsx
"use client";

import { useState, useMemo } from "react";
import { TextElement } from "@/types/certificates";
import {
  Search,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface TextControlsProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
}

// Comprehensive font list with categories
const FONT_FAMILIES = [
  // Serif Fonts
  { name: "Georgia", category: "Serif" },
  { name: "Times New Roman", category: "Serif" },
  { name: "Garamond", category: "Serif" },
  { name: "Palatino", category: "Serif" },
  { name: "Baskerville", category: "Serif" },
  { name: "Cambria", category: "Serif" },
  { name: "Didot", category: "Serif" },
  { name: "Bodoni", category: "Serif" },

  // Sans-Serif Fonts
  { name: "Arial", category: "Sans-Serif" },
  { name: "Helvetica", category: "Sans-Serif" },
  { name: "Verdana", category: "Sans-Serif" },
  { name: "Trebuchet MS", category: "Sans-Serif" },
  { name: "Calibri", category: "Sans-Serif" },
  { name: "Tahoma", category: "Sans-Serif" },
  { name: "Geneva", category: "Sans-Serif" },
  { name: "Century Gothic", category: "Sans-Serif" },
  { name: "Futura", category: "Sans-Serif" },

  // Monospace Fonts
  { name: "Courier New", category: "Monospace" },
  { name: "Consolas", category: "Monospace" },
  { name: "Monaco", category: "Monospace" },

  // Display/Decorative Fonts
  { name: "Impact", category: "Display" },
  { name: "Comic Sans MS", category: "Display" },
  { name: "Brush Script MT", category: "Display" },
  { name: "Lucida Handwriting", category: "Display" },
  { name: "Copperplate", category: "Display" },
  { name: "Papyrus", category: "Display" },
];

// Font size presets
const FONT_SIZE_PRESETS = [
  { label: "XS", value: 12 },
  { label: "S", value: 16 },
  { label: "M", value: 24 },
  { label: "L", value: 32 },
  { label: "XL", value: 48 },
  { label: "2XL", value: 64 },
  { label: "3XL", value: 80 },
  { label: "4XL", value: 96 },
];

// Popular color presets
const COLOR_PRESETS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Gold", value: "#d97706" },
  { name: "Dark Gold", value: "#92400e" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Gray", value: "#6b7280" },
];

export default function TextControls({ element, onUpdate }: TextControlsProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  // Filter fonts based on search
  const filteredFonts = useMemo(() => {
    if (!fontSearch.trim()) return FONT_FAMILIES;

    const search = fontSearch.toLowerCase();
    return FONT_FAMILIES.filter(
      (font) =>
        font.name.toLowerCase().includes(search) ||
        font.category.toLowerCase().includes(search)
    );
  }, [fontSearch]);

  // Group fonts by category
  const groupedFonts = useMemo(() => {
    const groups: Record<string, typeof FONT_FAMILIES> = {};
    filteredFonts.forEach((font) => {
      if (!groups[font.category]) {
        groups[font.category] = [];
      }
      groups[font.category].push(font);
    });
    return groups;
  }, [filteredFonts]);

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Text Content
        </label>
        <textarea
          value={element.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-zinc-800 dark:border-zinc-600"
          rows={3}
          placeholder="Enter your text here..."
        />
      </div>

      {/* Font Family with Search */}
      <div>
        <label className="block text-sm font-semibold mb-2">Font Family</label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={fontSearch || element.fontFamily}
              onChange={(e) => setFontSearch(e.target.value)}
              onFocus={() => setShowFontDropdown(true)}
              placeholder="Search fonts..."
              className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-zinc-800 dark:border-zinc-600"
            />
          </div>

          {/* Font Dropdown */}
          {showFontDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFontDropdown(false)}
              />
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-800 border-2 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {Object.keys(groupedFonts).length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No fonts found
                  </div>
                ) : (
                  Object.entries(groupedFonts).map(([category, fonts]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 dark:bg-zinc-700 sticky top-0">
                        {category}
                      </div>
                      {fonts.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            onUpdate({ fontFamily: font.name });
                            setFontSearch("");
                            setShowFontDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors ${
                            element.fontFamily === font.name
                              ? "bg-blue-100 dark:bg-blue-900/30 font-semibold"
                              : ""
                          }`}
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Selected: <span className="font-medium">{element.fontFamily}</span>
        </p>
      </div>

      {/* Font Size Presets + Custom Input */}
      <div>
        <label className="block text-sm font-semibold mb-2">Font Size</label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {FONT_SIZE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onUpdate({ fontSize: preset.value })}
              className={`px-3 py-3 border-2 rounded-lg font-semibold transition-all ${
                element.fontSize === preset.value
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg scale-105"
                  : "border-gray-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700"
              }`}
            >
              <div className="text-xs opacity-75">{preset.label}</div>
              <div className="text-sm">{preset.value}px</div>
            </button>
          ))}
        </div>

        {/* Custom Size Input */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Custom:
          </label>
          <input
            type="number"
            min="8"
            max="200"
            value={element.fontSize}
            onChange={(e) =>
              onUpdate({ fontSize: parseInt(e.target.value) || 24 })
            }
            className="flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600"
          />
          <span className="text-sm text-gray-500">px</span>
        </div>
      </div>

      {/* Color Picker with Presets */}
      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Color
        </label>

        {/* Color Presets */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ color: color.value })}
              className={`relative h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                element.color.toLowerCase() === color.value.toLowerCase()
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 dark:border-zinc-600"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {element.color.toLowerCase() === color.value.toLowerCase() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-800" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Color */}
        <div className="flex gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-16 h-12 rounded-lg cursor-pointer border-2"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 font-mono"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Font Weight & Style Combined */}
      <div className="grid grid-cols-2 gap-4">
        {/* Font Weight */}
        <div>
          <label className="block text-sm font-semibold mb-2">Weight</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ fontWeight: "normal" })}
              className={`flex-1 px-3 py-3 border-2 rounded-lg transition-all ${
                element.fontWeight === "normal"
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                  : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onUpdate({ fontWeight: "bold" })}
              className={`flex-1 px-3 py-3 border-2 rounded-lg font-bold transition-all ${
                element.fontWeight === "bold"
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                  : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
              }`}
            >
              Bold
            </button>
          </div>
        </div>

        {/* Font Style */}
        <div>
          <label className="block text-sm font-semibold mb-2">Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ fontStyle: "normal" })}
              className={`flex-1 px-3 py-3 border-2 rounded-lg transition-all ${
                element.fontStyle === "normal"
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                  : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onUpdate({ fontStyle: "italic" })}
              className={`flex-1 px-3 py-3 border-2 rounded-lg italic transition-all ${
                element.fontStyle === "italic"
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                  : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
              }`}
            >
              Italic
            </button>
          </div>
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Text Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdate({ textAlign: "left" })}
            className={`px-4 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              element.textAlign === "left"
                ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            Left
          </button>
          <button
            onClick={() => onUpdate({ textAlign: "center" })}
            className={`px-4 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              element.textAlign === "center"
                ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
            }`}
          >
            <AlignCenter className="w-4 h-4" />
            Center
          </button>
          <button
            onClick={() => onUpdate({ textAlign: "right" })}
            className={`px-4 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              element.textAlign === "right"
                ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                : "border-gray-300 dark:border-zinc-600 hover:border-blue-400"
            }`}
          >
            <AlignRight className="w-4 h-4" />
            Right
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-6 p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-zinc-800">
        <p className="text-xs font-semibold text-gray-500 mb-2">Preview:</p>
        <div
          style={{
            fontFamily: element.fontFamily,
            fontSize: `${Math.min(element.fontSize, 32)}px`,
            color: element.color,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textAlign: element.textAlign,
          }}
        >
          {element.text || "Your text will appear here"}
        </div>
      </div>
    </div>
  );
}
