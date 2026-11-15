"use client";

import React, { useState } from "react";
import { X, FileUp, Download, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { MonthlyRecord } from "@/data/monthlyObservations";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: MonthlyRecord[], datasetName: string) => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [csvContent, setCsvContent] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<MonthlyRecord[]>([]);

  if (!isOpen) return null;

  const sampleCsv = `date,rainfall_mm,soil_moisture,ndvi
2024-01,14.5,0.162,0.342
2024-02,22.1,0.155,0.315
2024-03,45.0,0.170,0.330
2024-04,95.2,0.210,0.440
2024-05,62.4,0.195,0.485
2024-06,10.2,0.160,0.410
2024-07,7.8,0.150,0.365
2024-08,8.5,0.148,0.350
2024-09,19.2,0.152,0.355
2024-10,65.0,0.185,0.420
2024-11,48.2,0.190,0.445`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "aether_sample_schema.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseAndValidate = (text: string) => {
    const errors: string[] = [];
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      errors.push("CSV file must contain a header row and at least one observation row.");
      setValidationErrors(errors);
      return;
    }

    const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
    const reqHeaders = ["date", "rainfall_mm", "soil_moisture", "ndvi"];
    for (const req of reqHeaders) {
      if (!header.includes(req)) {
        errors.push(`Missing mandatory column header: '${req}'`);
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const dateIdx = header.indexOf("date");
    const rainIdx = header.indexOf("rainfall_mm");
    const soilIdx = header.indexOf("soil_moisture");
    const ndviIdx = header.indexOf("ndvi");

    const validRecords: MonthlyRecord[] = [];
    const seenDates = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(",").map((c) => c.trim());

      const dateStr = cols[dateIdx];
      const rain = Number(cols[rainIdx]);
      const soil = Number(cols[soilIdx]);
      const ndvi = Number(cols[ndviIdx]);

      // Date validation (YYYY-MM)
      const dateMatch = /^(\d{4})-(\d{2})$/.exec(dateStr);
      if (!dateMatch || Number(dateMatch[1]) < 1 || Number(dateMatch[2]) < 1 || Number(dateMatch[2]) > 12) {
        errors.push(`Row ${i + 1}: Invalid date format '${dateStr}'. Expected YYYY-MM.`);
        break;
      }

      if (seenDates.has(dateStr)) {
        errors.push(`Row ${i + 1}: Duplicate monthly date '${dateStr}'.`);
        break;
      }
      seenDates.add(dateStr);

      if (!Number.isFinite(rain) || cols[rainIdx] === "" || rain < 0) {
        errors.push(`Row ${i + 1}: Invalid rainfall value '${cols[rainIdx]}'. Must be a non-negative number.`);
        break;
      }

      if (!Number.isFinite(soil) || cols[soilIdx] === "" || soil < 0 || soil > 1.0) {
        errors.push(`Row ${i + 1}: Invalid soil moisture value '${cols[soilIdx]}'. Expected volumetric m³/m³ between 0.0 and 1.0.`);
        break;
      }

      if (!Number.isFinite(ndvi) || cols[ndviIdx] === "" || ndvi < -1.0 || ndvi > 1.0) {
        errors.push(`Row ${i + 1}: Invalid NDVI value '${cols[ndviIdx]}'. Expected range [-1.0, 1.0].`);
        break;
      }

      const parts = dateStr.split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);

      validRecords.push({
        year,
        month,
        date: `${year}-${month < 10 ? `0${month}` : month}`,
        rainfallMm: rain,
        soilMoistureM3M3: soil,
        ndvi: ndvi,
        isDemonstration: false,
      });
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationSuccess(null);
      setParsedPreview([]);
    } else {
      setValidationErrors([]);
      setValidationSuccess(`Successfully validated ${validRecords.length} observation records.`);
      setParsedPreview(validRecords);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      parseAndValidate(text);
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (parsedPreview.length > 0) {
      onDataLoaded(parsedPreview, "Custom Uploaded Dataset");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-2xl p-6 rounded-3xl nasa-panel-blue border border-accent-secondary/40 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-panel-border/30">
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-text-primary tracking-wide">
              Ingest Custom Satellite / Climate CSV
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-subtle hover:text-text-primary hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Schema Instructions */}
        <div className="text-xs text-text-secondary space-y-1">
          <p>
            Upload a CSV file conforming to the Aether observation schema. Values will be ingested into the <strong>Drought Fingerprint Engine</strong> and <strong>Trend Detective</strong>.
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-text-subtle font-bold">
              Required Columns: date, rainfall_mm, soil_moisture, ndvi
            </span>
            <button
              onClick={handleDownloadSample}
              className="text-accent-cyan hover:underline flex items-center gap-1 font-bold"
            >
              <Download className="w-3 h-3" />
              <span>Download Schema Template</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Area */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-panel-border/50 hover:border-accent-cyan/60 transition-colors text-center bg-black/40">
          <FileUp className="w-8 h-8 text-accent-cyan mx-auto mb-2 opacity-80" />
          <p className="text-xs text-text-primary font-bold mb-1">
            Drag and drop your CSV file here, or click to browse
          </p>
          <p className="text-[10px] text-text-subtle mb-3">
            Supports NASA Giovanni CSV exports, FLDAS tables, and meteorological logs (.csv)
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-accent-blue file:text-white hover:file:bg-accent-blue/80 cursor-pointer"
          />
        </div>

        {/* Validation Feedback */}
        {validationErrors.length > 0 && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>CSV Schema Validation Errors:</span>
            </div>
            {validationErrors.map((err, idx) => (
              <p key={idx} className="text-[11px] pl-5">• {err}</p>
            ))}
          </div>
        )}

        {validationSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{validationSuccess} Ready for ingestion into the analytical engine.</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-panel-border/30 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-panel-dark text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={parsedPreview.length === 0}
            className="px-5 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/80 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all shadow-glow-blue"
          >
            Ingest & Recalculate
          </button>
        </div>
      </div>
    </div>
  );
};
