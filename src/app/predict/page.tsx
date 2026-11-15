"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, BrainCircuit, Database, ExternalLink } from "lucide-react";

interface ModelMetrics {
  count: number;
  mae: number;
  rmse: number;
  intervalCoverage95?: number;
}

interface PredictorPayload {
  model: {
    name: string;
    status: string;
    target: string;
    horizonMonths: number;
    kernel: string;
    targetTransform: string;
    parameters: {
      periodicLengthScale: number;
      temporalLengthScale: number;
      noiseStandardDeviation: number;
    };
    validation: {
      method: string;
      start: string;
      end: string;
      gpr: ModelMetrics;
      seasonalNaiveBaseline: ModelMetrics;
    };
  };
  source: {
    provider: string;
    product: string;
    units: string;
    unitNote: string;
    dailyInputCount: number;
    monthlyObservationCount: number;
    observationPeriod: { start: string; end: string };
    lastObservationDate: string;
    limitations: string[];
  };
  forecast: {
    date: string;
    generatedAt: string;
    basedOnObservationThrough: string;
    horizonMonths: number;
    mean: number;
    lower95: number;
    upper95: number;
    intervalLevel: number;
    units: string;
    interpretation: string;
  };
  history: Array<{ date: string; value: number; dailyCount: number }>;
  trainingStatus: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMetric(value: unknown): value is ModelMetrics {
  return isRecord(value) && typeof value.count === "number" &&
    typeof value.mae === "number" && typeof value.rmse === "number";
}

function isPredictorPayload(value: unknown): value is PredictorPayload {
  if (!isRecord(value) || !isRecord(value.model) || !isRecord(value.model.validation) ||
      !isRecord(value.source) || !isRecord(value.source.observationPeriod) ||
      !isRecord(value.forecast) || !Array.isArray(value.history)) return false;
  return typeof value.model.name === "string" &&
    isMetric(value.model.validation.gpr) &&
    isMetric(value.model.validation.seasonalNaiveBaseline) &&
    typeof value.source.provider === "string" &&
    typeof value.source.product === "string" &&
    typeof value.source.units === "string" &&
    typeof value.source.lastObservationDate === "string" &&
    typeof value.forecast.date === "string" &&
    typeof value.forecast.mean === "number" &&
    typeof value.forecast.lower95 === "number" &&
    typeof value.forecast.upper95 === "number" &&
    value.history.every((item) => isRecord(item) && typeof item.date === "string" && typeof item.value === "number");
}

function formatValue(value: number) {
  return value.toFixed(5);
}

export default function PredictorPage() {
  const [data, setData] = useState<PredictorPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/predictions/rainfall", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Predictor request failed with HTTP ${response.status}.`);
        const payload: unknown = await response.json();
        if (!isPredictorPayload(payload)) throw new TypeError("Predictor returned an invalid response.");
        return payload;
      })
      .then((payload) => {
        if (active) {
          setData(payload);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load the experimental predictor.");
      });
    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      ...data.history.slice(-36).map((item) => ({ date: item.date, observed: item.value, forecast: null })),
      { date: data.forecast.date, observed: null, forecast: data.forecast.mean },
    ];
  }, [data]);

  const gprImprovement = data
    ? (1 - data.model.validation.gpr.mae / data.model.validation.seasonalNaiveBaseline.mae) * 100
    : null;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const forecastIsHistorical = data ? data.forecast.date < currentMonth : false;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 lg:px-8">
      <header className="rounded-3xl border border-accent-secondary/35 bg-panel-dark p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent-light">
          <BrainCircuit className="h-4 w-4 text-accent-cyan" />
          AETHER · EXPERIMENTAL PREDICTOR
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-wide text-text-primary lg:text-3xl">
          One-month rainfall forecast
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-text-secondary">
          A first-draft Gaussian Process Regression trained only on the supplied national-box rainfall series. This does not predict Borena or individual zones, and it does not forecast soil moisture.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          Predictor unavailable: {error}
        </div>
      )}
      {!data && !error && (
        <div role="status" className="h-40 animate-pulse rounded-3xl bg-panel-dark" />
      )}

      {data && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-accent-cyan/30 bg-panel-dark p-4">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">Next model step</p>
              <p className="mt-2 text-xl font-bold text-text-primary">{data.forecast.date}</p>
              <p className="mt-1 text-[10px] text-text-secondary">Based on observations through {data.forecast.basedOnObservationThrough}</p>
            </article>
            <article className="rounded-2xl border border-accent-cyan/30 bg-panel-dark p-4">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">GPR mean · source-value scale</p>
              <p className="mt-2 text-xl font-bold text-accent-cyan">{formatValue(data.forecast.mean)}</p>
              <p className="mt-1 text-[10px] text-text-secondary">Units not stated in input CSV</p>
            </article>
            <article className="rounded-2xl border border-accent-cyan/30 bg-panel-dark p-4">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">95% model interval</p>
              <p className="mt-2 text-xl font-bold text-text-primary">
                {formatValue(data.forecast.lower95)} – {formatValue(data.forecast.upper95)}
              </p>
              <p className="mt-1 text-[10px] text-text-secondary">Unverified source-value scale</p>
            </article>
            <article className={`rounded-2xl border p-4 ${forecastIsHistorical ? "border-red-500/40 bg-red-950/25" : "border-amber-500/40 bg-amber-950/25"}`}>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                {forecastIsHistorical ? "Historical forecast" : "Experimental forecast"}
              </p>
              <p className="mt-2 text-sm font-bold text-text-primary">
                Latest data: {data.source.lastObservationDate}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-text-secondary">
                {forecastIsHistorical
                  ? `The predicted ${data.forecast.date} step is in the past, not a current outlook.`
                  : "Not an operational drought warning."}
              </p>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article className="rounded-3xl border border-panel-border/30 bg-panel-dark p-5">
              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">Monthly source series and forecast</h2>
                <p className="mt-1 text-[10px] text-text-secondary">
                  Last 36 monthly means from the Ethiopia bounding box; forecast is the next model step.
                </p>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 12, right: 18, bottom: 8, left: 2 }}>
                    <CartesianGrid stroke="#243148" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 9 }} interval={5} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", borderColor: "#41619F", borderRadius: "0.75rem", fontSize: "11px" }}
                      formatter={(value: number | string, name: string) => [value, name === "observed" ? "Observed monthly mean" : "GPR forecast"]}
                    />
                    <ReferenceArea
                      x1={data.source.observationPeriod.end}
                      x2={data.forecast.date}
                      y1={data.forecast.lower95}
                      y2={data.forecast.upper95}
                      fill="#28D7C5"
                      fillOpacity={0.14}
                      strokeOpacity={0}
                    />
                    <Line
                      type="monotone"
                      dataKey="observed"
                      name="Observed monthly mean"
                      stroke="#28D7C5"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      connectNulls={false}
                    />
                    <ReferenceLine x={data.forecast.date} stroke="#F59E0B" strokeDasharray="4 4" />
                    <ReferenceDot
                      x={data.forecast.date}
                      y={data.forecast.mean}
                      r={6}
                      fill="#F59E0B"
                      stroke="#fff"
                      label={{ value: "GPR", fill: "#FCD34D", fontSize: 10, position: "top" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div
                aria-label="Predicted rainfall values"
                className="mt-4 grid gap-3 rounded-xl border border-accent-cyan/25 bg-panel-dark/70 p-3 text-xs sm:grid-cols-3"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-subtle">Predicted period</p>
                  <p className="mt-1 font-bold text-text-primary">{data.forecast.date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-subtle">Predicted mean</p>
                  <p className="mt-1 font-bold text-accent-cyan">{formatValue(data.forecast.mean)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-subtle">95% model interval</p>
                  <p className="mt-1 font-bold text-text-primary">
                    {formatValue(data.forecast.lower95)} – {formatValue(data.forecast.upper95)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-text-subtle">
                Source-value scale; units are not stated in the input data.
              </p>
            </article>

            <aside className="space-y-4 rounded-3xl border border-panel-border/30 bg-panel-dark p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">Chronological holdout check</h2>
              <p className="text-[10px] leading-relaxed text-text-secondary">
                {data.model.validation.method} Validation: {data.model.validation.start} to {data.model.validation.end}.
              </p>
              <div className="space-y-3">
                <div className="rounded-xl border border-panel-border/30 bg-panel-dark/70 p-3">
                  <p className="text-[10px] text-text-subtle">GPR MAE · {data.model.validation.gpr.count} months</p>
                  <p className="mt-1 text-lg font-bold text-accent-cyan">{formatValue(data.model.validation.gpr.mae)}</p>
                  <p className="text-[10px] text-text-secondary">RMSE {formatValue(data.model.validation.gpr.rmse)}</p>
                </div>
                <div className="rounded-xl border border-panel-border/30 bg-panel-dark/70 p-3">
                  <p className="text-[10px] text-text-subtle">Seasonal-naive MAE · same test months</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">{formatValue(data.model.validation.seasonalNaiveBaseline.mae)}</p>
                  <p className="text-[10px] text-text-secondary">RMSE {formatValue(data.model.validation.seasonalNaiveBaseline.rmse)}</p>
                </div>
                <div className="rounded-xl border border-panel-border/30 bg-panel-dark/70 p-3">
                  <p className="text-[10px] text-text-subtle">GPR 95% interval coverage</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {((data.model.validation.gpr.intervalCoverage95 ?? 0) * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-text-secondary">Observed holdout months inside the model interval</p>
                </div>
              </div>
              {gprImprovement !== null && (
                <p className="text-[10px] leading-relaxed text-text-secondary">
                  On this one-year holdout, GPR MAE was {gprImprovement >= 0 ? `${gprImprovement.toFixed(1)}% lower` : `${Math.abs(gprImprovement).toFixed(1)}% higher`} than seasonal-naive. One validation year is too small to establish reliable forecast skill.
                </p>
              )}
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
                <Database className="h-4 w-4" />
                Source and scope
              </h2>
              <dl className="mt-3 space-y-2 text-[10px]">
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Product</dt><dd className="text-right text-text-primary">{data.source.product}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Spatial scope</dt><dd className="text-right text-text-primary">Ethiopia bounding-box average</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Daily records</dt><dd className="text-right text-text-primary">{data.source.dailyInputCount.toLocaleString()}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Monthly model records</dt><dd className="text-right text-text-primary">{data.source.monthlyObservationCount}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Coverage</dt><dd className="text-right text-text-primary">{data.source.observationPeriod.start} – {data.source.observationPeriod.end}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-text-subtle">Unit note</dt><dd className="max-w-[65%] text-right text-text-primary">{data.source.unitNote}</dd></div>
              </dl>
              <a
                href="https://gpm.nasa.gov/data/imerg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-[10px] text-accent-light hover:text-accent-cyan"
              >
                NASA IMERG product information <ExternalLink className="h-3 w-3" />
              </a>
            </article>
            <article className="rounded-2xl border border-panel-border/30 bg-panel-dark p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">Model limits</h2>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-[10px] leading-relaxed text-text-secondary">
                {data.source.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                <li>Soil moisture and zone-specific rainfall are not forecast by this model.</li>
              </ul>
              <Link href="/data" className="mt-4 inline-block text-[10px] text-accent-light hover:text-accent-cyan">
                View data and the 72-zone overlay
              </Link>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
