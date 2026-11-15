"use client";

import React, { useEffect, useState } from "react";
import { translations, Language } from "@/data/translations";
import { SAMPLE_ALERTS, SAMPLE_AUTHORITY_CONTACTS } from "@/data/alertsData";
import { EnvironmentalAlert, AuthorityContact } from "@/types/alerts";
import {
  Bell,
  Radio,
  Send,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  Lock,
  Users,
  FileText,
  Workflow,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Building2,
  FileCheck2,
  Filter
} from "lucide-react";

interface AlertsPageProps {
  lang: Language;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ lang }) => {
  const t = translations[lang];
  const isAmharic = lang === "am";

  const [selectedAlertId, setSelectedAlertId] = useState<string>(SAMPLE_ALERTS[0].id);
  const selectedAlert = SAMPLE_ALERTS.find((a) => a.id === selectedAlertId) || SAMPLE_ALERTS[0];

  // Editable SMS message state
  const defaultSmsText = `AETHER SAMPLE ONLY: Fictional workflow scenario for ${selectedAlert.regionName} (${selectedAlert.observationPeriod}). No environmental measurements were analyzed and no drought condition was detected. Not an operational warning. Scenario: ${selectedAlert.referenceNumber}.`;

  const [smsDraft, setSmsDraft] = useState<string>(defaultSmsText);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedContactCategory, setSelectedContactCategory] = useState<string>("all");
  const [latestSourceMonth, setLatestSourceMonth] = useState<string | "loading" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/v1/observations/borena")
      .then(async (response) => {
        if (!response.ok) throw new Error("Observation source unavailable.");
        return response.json() as Promise<{ records?: Array<{ date?: string }> }>;
      })
      .then((payload) => {
        if (!active) return;
        const latest = payload.records?.[payload.records.length - 1]?.date;
        setLatestSourceMonth(typeof latest === "string" ? latest : "unavailable");
      })
      .catch(() => {
        if (active) setLatestSourceMonth("unavailable");
      });
    return () => { active = false; };
  }, []);

  // Update draft when alert selection changes
  const handleSelectAlert = (alert: EnvironmentalAlert) => {
    setSelectedAlertId(alert.id);
    const newText = `AETHER SAMPLE ONLY: Fictional workflow scenario for ${alert.regionName} (${alert.observationPeriod}). No environmental measurements were analyzed and no drought condition was detected. Not an operational warning. Scenario: ${alert.referenceNumber}.`;
    setSmsDraft(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(smsDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredContacts = SAMPLE_AUTHORITY_CONTACTS.filter((c) => {
    if (selectedContactCategory === "all") return true;
    return c.organizationCategory === selectedContactCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 font-mono">
      {/* 15.5 MANDATORY GATEWAY STATUS BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-950/30 border border-amber-500/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  SMS GATEWAY — NOT CONNECTED
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  SAMPLE / DEMO MODE ONLY
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-3xl">
                Automated environmental dispatch is blocked. NASA POWER MERRA-2 provides historical monthly data only{latestSourceMonth === "loading" ? " (checking source)" : latestSourceMonth === "unavailable" ? " (source unavailable)" : ` (latest record: ${latestSourceMonth})`}; it is not a near-real-time warning feed. GPM, FLDAS, MODIS NDVI, and verified authority contacts are not connected. Email remains approval-gated and SMS is simulation-only; no operational warning is sent.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-amber-300 bg-panel-dark/90 px-3.5 py-2 rounded-xl border border-amber-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>DISPATCH LOCKED</span>
          </div>
        </div>
      </div>

      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl nasa-panel-blue border border-accent-secondary/35 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-accent-cyan" />
              <span className="text-xs tracking-widest text-accent-light uppercase">
                EARTH OBSERVATION EARLY WARNING DEMONSTRATION
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-wide">
              AETHER ALERT
            </h1>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
              Workflow prototype only. The examples below use fictional inputs and are not linked to NASA observations, current conditions, or verified authority contacts.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-panel-dark border border-panel-border/40 text-xs text-accent-cyan font-mono">
            3 Sample Scenarios Loaded
          </div>
        </div>
      </div>

      {/* 15.1 & 15.2: RECENT SAMPLE ALERTS & EVIDENCE EXPLORER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample Alert List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-1">
            <span>FICTIONAL SAMPLE SCENARIOS · NOT MEASUREMENTS</span>
            <span className="text-accent-cyan">Select Scenario</span>
          </div>

          {SAMPLE_ALERTS.map((alert) => {
            const isSelected = alert.id === selectedAlertId;
            return (
              <div
                key={alert.id}
                onClick={() => handleSelectAlert(alert)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-panel border-accent-cyan shadow-[0_0_20px_rgba(40,215,197,0.25)] ring-1 ring-accent-cyan/50"
                    : "bg-panel-dark/80 border-panel-border/30 hover:border-accent-secondary/60 opacity-85 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-panel-dark text-[10px] font-mono font-bold text-accent-cyan border border-panel-border/40">
                      {alert.referenceNumber}
                    </span>
                    <span className="text-xs font-mono text-text-subtle uppercase">
                      SCENARIO {alert.observationDate}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                      alert.severity === "severe"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : alert.severity === "high"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    }`}
                  >
                    {alert.reviewStatus.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="font-bold text-sm text-text-primary mb-1">
                  {isAmharic ? alert.regionNameAm : alert.regionName}
                </div>
                <div className="text-xs text-accent-light font-medium mb-2">
                  {isAmharic ? alert.classificationTitleAm : alert.classificationTitle}
                </div>

                {/* Indicators mini-pills */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary pt-2 border-t border-panel-border/20">
                  <span>Rain: {alert.indicatorsInvolved.rainfallZ > 0 ? "+" : ""}{alert.indicatorsInvolved.rainfallZ.toFixed(1)}σ</span>
                  <span>·</span>
                  <span>Soil: {alert.indicatorsInvolved.soilZ.toFixed(1)}σ</span>
                  <span>·</span>
                  <span>NDVI: {alert.indicatorsInvolved.vegZ.toFixed(1)}σ</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Alert Detailed Evidence (7 cols) */}
        <div className="lg:col-span-7 nasa-panel p-6 rounded-3xl border border-accent-secondary/35 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-panel-border/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-accent-cyan uppercase">ILLUSTRATIVE SCENARIO DOSSIER</span>
                  <span className="text-text-subtle">|</span>
                  <span className="text-xs font-mono text-text-primary">{selectedAlert.referenceNumber}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  {isAmharic ? selectedAlert.regionNameAm : selectedAlert.regionName}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Scenario Period: {selectedAlert.observationPeriod}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-text-subtle uppercase block">Observation quality</span>
                <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                  INSUFFICIENT · SAMPLE
                </span>
              </div>
            </div>

            {/* Evidence Explanation with Mandatory Exact Phrase */}
            <div className="mt-4 p-4 rounded-2xl bg-panel-dark/90 border border-accent-secondary/30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Environmental Trigger Diagnosis</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed">
                {selectedAlert.explanation}
              </p>
            </div>

            {/* Supporting Measurements Ledger */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-mono text-text-secondary uppercase">
                Illustrative Scenario Inputs (Not Satellite Measurements):
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {selectedAlert.supportingMeasurements.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-panel-dark/60 border border-panel-border/20 flex items-center gap-2 text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Environmental Response Considerations */}
            <div className="mt-5">
              <span className="text-xs font-mono text-text-secondary uppercase">
                Hypothetical Scenario Considerations:
              </span>
              <ul className="mt-2 space-y-1 text-xs text-text-secondary list-disc list-inside">
                {selectedAlert.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-panel-border/20 text-[10px] font-mono text-text-subtle flex items-center justify-between">
            <span>Scenario note: {selectedAlert.dataQualityNote}</span>
            <span className="text-amber-400 uppercase">● DEMO SIMULATION</span>
          </div>
        </div>
      </div>

      {/* 15.3: SMS MESSAGE GENERATOR & PREVIEW */}
      <div className="nasa-panel p-6 sm:p-8 rounded-3xl border border-accent-secondary/35 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-panel-border/30">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent-cyan uppercase mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS NOTIFICATION GENERATOR (SAMPLE PREVIEW)</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">
              Generate & Preview Sample Authority Notification
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Preview and edit fictional sample text. No environmental observations were analyzed; messages cannot be sent from this interface.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-panel hover:bg-accent-cyan hover:text-[#040507] text-accent-light transition-all text-xs font-mono border border-panel-border/40 font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Sample Text!" : "Copy Sample SMS"}</span>
            </button>
          </div>
        </div>

        {/* Interactive SMS Textarea Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
              <span>EDITABLE SAMPLE DRAFT (STANDARD ADVISORY FORMAT):</span>
              <span>{smsDraft.length} Characters (~{Math.ceil(smsDraft.length / 160)} SMS parts)</span>
            </div>
            <textarea
              rows={5}
              value={smsDraft}
              onChange={(e) => setSmsDraft(e.target.value)}
              className="w-full p-4 rounded-2xl bg-panel-dark/90 border border-panel-border/40 text-xs sm:text-sm font-mono text-text-primary focus:outline-none focus:border-accent-cyan leading-relaxed resize-none shadow-inner"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-text-subtle">
              <span>Reference Tag: {selectedAlert.referenceNumber}</span>
              <button
                onClick={() => handleSelectAlert(selectedAlert)}
                className="text-accent-cyan hover:underline"
              >
                Reset to Default Template
              </button>
            </div>
          </div>

          {/* Action Simulation Box */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-panel-dark/80 border border-panel-border/40 space-y-4">
            <div className="text-xs font-mono text-text-secondary uppercase">
              Dispatch Action (Demo Mode)
            </div>

            <div className="p-3 rounded-xl bg-panel border border-panel-border/30 text-xs font-mono text-text-secondary">
              <span className="block text-text-subtle text-[10px] uppercase mb-1">Target Organization:</span>
              <span className="font-bold text-text-primary">EDRMC & Regional DRM Focal Points</span>
            </div>

            {/* SEND BUTTON - VISIBLY DISABLED */}
            <div>
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl bg-panel-dark border border-panel-border/40 text-text-subtle text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                title="SMS dispatch is disabled in sample mode."
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>SEND SMS (DISABLED IN DEMO)</span>
              </button>
              <p className="text-[10px] font-mono text-amber-400/90 text-center mt-2">
                ⚠ Gateway disconnected. Real dispatch is permanently disabled in this demo interface.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 15.4: AUTHORITY CONTACT MANAGEMENT PREVIEW */}
      <div className="nasa-panel p-6 sm:p-8 rounded-3xl border border-accent-secondary/35 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-panel-border/30">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent-cyan uppercase mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>OFFICIAL CONTACT REGISTRY PREVIEW</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">
              Authority Contact Management Architecture
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Preview of how verified disaster prevention, pastoral development, and agro-met institutions will be registered and categorized for future authenticated dispatch.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-panel-dark/80 p-1 rounded-xl border border-panel-border/30 text-xs font-mono">
            <button
              onClick={() => setSelectedContactCategory("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedContactCategory === "all" ? "bg-accent-cyan text-[#040507] font-bold" : "text-text-secondary"
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedContactCategory("National Disaster Risk Management")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedContactCategory === "National Disaster Risk Management"
                  ? "bg-accent-cyan text-[#040507] font-bold"
                  : "text-text-secondary"
              }`}
            >
              National DRM
            </button>
            <button
              onClick={() => setSelectedContactCategory("Regional Disaster Risk Management")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedContactCategory === "Regional Disaster Risk Management"
                  ? "bg-accent-cyan text-[#040507] font-bold"
                  : "text-text-secondary"
              }`}
            >
              Regional DRM
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-panel-border/30 text-text-secondary">
                <th className="py-2.5 px-3">Organization Name</th>
                <th className="py-2.5 px-3">Official Role / Desk</th>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3">Telephone (Demo)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Language</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border/10">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-bold text-text-primary">{c.organizationName}</td>
                  <td className="py-3 px-3 text-text-secondary">{c.officialRole}</td>
                  <td className="py-3 px-3 text-accent-light">{c.region}</td>
                  <td className="py-3 px-3 text-text-subtle">{c.placeholderPhone}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-panel-dark text-amber-300 border border-amber-500/30 uppercase">
                      {c.verificationStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-accent-cyan">{c.preferredLanguage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] font-mono text-text-subtle pt-2">
          Note: All contact entries displayed above are placeholder organization profiles. No personal phone numbers are stored or used.
        </div>
      </div>

      {/* 15.6: HUMAN APPROVAL WORKFLOW PREVIEW */}
      <div className="nasa-panel p-6 sm:p-8 rounded-3xl border border-accent-secondary/35 shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent-cyan uppercase mb-1">
            <Workflow className="w-3.5 h-3.5" />
            <span>OPERATIONAL SAFEGUARDS</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            5-Stage Human Verification & Authorization Protocol
          </h3>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            In future operational phases, no alert will be dispatched automatically. Every notification will require human verification through a strict multi-tier review workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: "01",
              title: "Anomaly Detection",
              desc: "No automated environmental detection is active. Verified inputs would be required before any investigation workflow is considered.",
            },
            {
              step: "02",
              title: "Draft Advisory",
              desc: "Aether engine synthesizes standard notification with report ID.",
            },
            {
              step: "03",
              title: "Scientific Review",
              desc: "Authorized remote sensing specialist validates physical signal plausibility.",
            },
            {
              step: "04",
              title: "Human Approval",
              desc: "Reviewer approves, edits, or rejects the draft before any transmission.",
            },
            {
              step: "05",
              title: "Audit Logging",
              desc: "Notification status, timestamp, and audit trail recorded permanently.",
            },
          ].map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/30 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-panel flex items-center justify-center font-bold text-xs text-accent-cyan mb-3 border border-panel-border/40">
                  {s.step}
                </div>
                <h4 className="font-bold text-sm text-text-primary mb-1">{s.title}</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 15.7: SCIENTIFIC AND OPERATIONAL TRANSPARENCY NOTICE */}
      <div className="p-6 rounded-3xl bg-panel-dark/60 border border-panel-border/30 space-y-2 text-xs text-text-secondary leading-relaxed">
        <div className="font-bold text-text-primary flex items-center gap-2 text-accent-cyan text-sm mb-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Scientific & Operational Transparency Principles</span>
        </div>
        <p>
          1. <strong>Indicators vs Direct Impact:</strong> Satellite observations measure atmospheric precipitation, root-zone soil moisture, and canopy optical reflectance. They are indicators of environmental conditions and do not constitute direct field confirmation of crop failure, livestock deaths, or household hunger.
        </p>
        <p>
          2. <strong>Non-Official Designation:</strong> Aether alerts are environmental monitoring notifications developed for research and early warning intelligence. They are not official government warnings, emergency decrees, or humanitarian appeals.
        </p>
        <p>
          3. <strong>Demonstration Status:</strong> All messages generated on this page are sample demonstrations only. The platform does not replace or interfere with official Ethiopian disaster management channels (such as EDRMC or regional DRMC bureaus).
        </p>
      </div>
    </div>
  );
};
