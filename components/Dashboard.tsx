"use client";

import { useMemo } from "react";
import { systems } from "@/data/systems";
import { useRemoteData, type RemoteState } from "@/hooks/useRemoteData";
import type { Report } from "@/lib/report";
import { loadMetar, loadWeather, METAR_STATION } from "@/lib/sources";
import { summarize, withStatus } from "@/lib/status";
import DashboardHeader from "./DashboardHeader";
import DataSection from "./DataSection";
import Section from "./Section";
import TileGrid from "./TileGrid";

function tilesOf(state: RemoteState<Report>) {
  return state.phase === "success" ? state.data.tiles : [];
}

export default function Dashboard() {
  const weather = useRemoteData(loadWeather);
  const metar = useRemoteData(loadMetar);

  // Overall picture: fold the status of ALL tiles (mock + every loaded source) into one summary.
  const summary = useMemo(
    () => summarize([...systems, ...tilesOf(weather.state), ...tilesOf(metar.state)].map((t) => withStatus(t).status)),
    [weather.state, metar.state],
  );

  const sources = [weather.state, metar.state];
  const loadingSources = sources.filter((s) => s.phase === "loading").length;
  const failedSources = sources.filter((s) => s.phase === "error").length;

  return (
    <div className="space-y-12">
      <DashboardHeader summary={summary} loadingSources={loadingSources} failedSources={failedSources} />

      <Section id="system" title="System" description="Lokale Systemmetriken (Mock-Daten)">
        <TileGrid systems={systems} />
      </Section>

      <DataSection
        id="weather"
        title="Wetter Luzern"
        fallbackDescription="OpenWeatherMap (JSON)"
        state={weather.state}
        isFetching={weather.isFetching}
        onRefresh={weather.refresh}
      />

      <DataSection
        id="metar"
        title={`Flughafen Zürich (${METAR_STATION})`}
        fallbackDescription="aviationweather.gov (XML)"
        state={metar.state}
        isFetching={metar.isFetching}
        onRefresh={metar.refresh}
      />
    </div>
  );
}
