import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type SchoolRecord = {
  id: number;
  nama: string;
  npsn: string;
  alamat: string;
  status: string;
  bentuk_pendidikan: string;
  akreditasi: string;
  jumlah_guru: number;
  jumlah_murid: number;
  lng: number;
  lat: number;
};

export async function GET() {
  try {
    const result = await pool.query<SchoolRecord>(`
      SELECT 
        id, nama, npsn, alamat, status, bentuk_pendidikan, akreditasi,
        jumlah_guru, jumlah_murid,
        ST_X(geometri) AS lng,
        ST_Y(geometri) AS lat
      FROM sekolah
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sekolah:', error);
    return NextResponse.json({ error: 'Failed to fetch sekolah data' }, { status: 500 });
  }
}
