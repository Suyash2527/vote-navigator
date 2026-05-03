"use client";

import { useState, useEffect } from "react";
import { Type, Moon, Sun, Contrast } from "lucide-react";

export default function A11yControls() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  useEffect(() => {
    // Apply contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Apply font size
    document.documentElement.classList.remove("text-large", "text-xlarge");
    if (fontSize !== "normal") {
      document.documentElement.classList.add(`text-${fontSize}`);
    }
  }, [highContrast, fontSize]);

  const cycleFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("xlarge");
    else setFontSize("normal");
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex gap-2" role="group" aria-label="Accessibility Controls">
      <button
        onClick={() => setHighContrast(!highContrast)}
        className="w-10 h-10 rounded-full glass bg-background/80 flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Toggle high contrast mode. Currently ${highContrast ? "on" : "off"}`}
        aria-pressed={highContrast}
      >
        <Contrast className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={cycleFontSize}
        className="w-10 h-10 rounded-full glass bg-background/80 flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Cycle font size. Current size: ${fontSize}`}
      >
        <Type className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
}
