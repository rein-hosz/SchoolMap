import { NextResponse } from "next/server";
import pool from "@/lib/db";

type KelurahanStatRecord = {
  id: number;
  kelurahan: string;
  kecamatan: string;
  total_schools: number;
  sd_count: number;
  smp_count: number;
  sma_count: number;
};

export async function GET() {
  try {
    const result = await pool.query<KelurahanStatRecord>(`
      SELECT 
        k.id, 
        k.kelurahan,
        k.kecamatan,
        COUNT(s.uuid) AS total_schools,
        COUNT(CASE WHEN s.bentuk_pendidikan = 'SD' THEN 1 END) AS sd_count,
        COUNT(CASE WHEN s.bentuk_pendidikan = 'SMP' THEN 1 END) AS smp_count,
        COUNT(CASE WHEN s.bentuk_pendidikan = 'SMA' THEN 1 END) AS sma_count
      FROM kelurahan k
      LEFT JOIN sekolah s ON k.id = s.kelurahan_id
      GROUP BY k.id, k.kelurahan, k.kecamatan
      ORDER BY k.kelurahan
    `);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { message: "No statistics found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching kelurahan statistics:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
