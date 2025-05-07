import { useState, useEffect } from "react";
import { FaChartPie, FaSchool } from "react-icons/fa6";
import { BiBuildings } from "react-icons/bi";

type KelurahanStat = {
  id: number;
  kelurahan: string;
  kecamatan: string;
  total_schools: number;
  sd_count: number;
  smp_count: number;
  sma_count: number;
};

interface KelurahanStatisticsProps {
  onSelectKelurahan?: (kelurahanId: number) => void;
  currentKelurahanId?: number | null;
}

export default function KelurahanStatistics({
  onSelectKelurahan,
  currentKelurahanId,
}: KelurahanStatisticsProps) {
  const [stats, setStats] = useState<KelurahanStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/kelurahan-stats");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
        console.error("Error fetching kelurahan stats:", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-600">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BiBuildings className="text-indigo-500 text-lg" />
        <h3 className="font-medium text-lg text-indigo-600">
          Kelurahan Statistics
        </h3>
      </div>

      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => onSelectKelurahan?.(stat.id)}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              currentKelurahanId === stat.id
                ? "border-indigo-400 bg-indigo-50 shadow-sm"
                : "border-neutral-200 bg-white hover:bg-neutral-50"
            }`}
            data-nav-button="true"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-base text-gray-800">
                  {stat.kelurahan}
                </div>
                <div className="text-xs text-gray-600">
                  Kecamatan {stat.kecamatan}
                </div>
              </div>
              <div className="bg-indigo-100 text-indigo-700 rounded-full px-2.5 py-1 text-xs font-medium flex items-center">
                <span>{stat.total_schools} schools</span>
              </div>
            </div>

            {stat.total_schools > 0 && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-md bg-blue-50">
                  <div className="text-blue-600 font-bold text-lg">
                    {stat.sd_count}
                  </div>
                  <div className="text-xs text-blue-700 font-medium">SD</div>
                </div>
                <div className="p-2 rounded-md bg-emerald-50">
                  <div className="text-emerald-600 font-bold text-lg">
                    {stat.smp_count}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    SMP
                  </div>
                </div>
                <div className="p-2 rounded-md bg-purple-50">
                  <div className="text-purple-600 font-bold text-lg">
                    {stat.sma_count}
                  </div>
                  <div className="text-xs text-purple-700 font-medium">SMA</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
