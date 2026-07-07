"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface CountryFeature {
  type: "Feature";
  properties: { name: string };
  geometry: any;
}

// Countries already "on the map" — mirrors the destinations Drift already
// showcases (Iceland, Amalfi Coast → Italy, Bali → Indonesia, Patagonia →
// Argentina/Chile, Morocco, Japan).
const EXPLORED = new Set([
  "Iceland",
  "Italy",
  "Indonesia",
  "Argentina",
  "Chile",
  "Morocco",
  "Japan",
]);

const WIDTH = 960;
const HEIGHT = 520;

export default function WorldExploreMap({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set(EXPLORED));
  const pathRef = useRef<d3.GeoPath | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
        );
        if (!res.ok) throw new Error("Failed to load country boundaries");
        const geojson = await res.json();
        if (cancelled) return;

        const projection: d3.GeoProjection = d3
          .geoNaturalEarth1()
          .fitSize([WIDTH, HEIGHT], geojson);
        pathRef.current = d3.geoPath(projection);
        setCountries(geojson.features);
      } catch (err) {
        if (!cancelled) setError("Failed to load the world map data");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-charcoal p-8 ${className}`}
      >
        <div className="text-center">
          <p className="mb-2 font-semibold text-ivory">The map didn&apos;t load</p>
          <p className="text-sm text-ivory/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Interactive world map"
      >
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#0B1226" />
        {countries &&
          pathRef.current &&
          countries.map((feature) => {
            const name = feature.properties.name;
            const d = pathRef.current!(feature as any) || undefined;
            const isVisited = visited.has(name);
            const isHovered = hovered === name;

            return (
              <path
                key={name}
                d={d}
                fill={
                  isVisited
                    ? "#38BDF8"
                    : isHovered
                    ? "#AFD2FA"
                    : "#1B2436"
                }
                fillOpacity={isVisited ? 0.9 : isHovered ? 0.7 : 1}
                stroke="#0A0D12"
                strokeWidth={0.5}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered((h) => (h === name ? null : h))}
                onClick={() =>
                  setVisited((prev) => {
                    const next = new Set(prev);
                    if (next.has(name)) {
                      next.delete(name);
                    } else {
                      next.add(name);
                    }
                    return next;
                  })
                }
              >
                <title>{name}</title>
              </path>
            );
          })}
      </svg>

      {!countries && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-ivory/40">Loading the map...</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 rounded-md bg-charcoal/70 px-2 py-1 text-xs text-ivory/50 backdrop-blur-sm">
        {hovered ?? "Click a country to add it to your map"}
      </div>
    </div>
  );
}
