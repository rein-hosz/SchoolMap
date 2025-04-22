import { useState } from "react";
import { Popup } from "react-leaflet";
import { Sekolah, getAkreditasiGradient, getSchoolColor } from "@/types/school";

interface SchoolPopupProps {
  school: Sekolah;
}

export default function SchoolPopup({ school }: SchoolPopupProps) {
  const [expandedAddress, setExpandedAddress] = useState(false);
  const schoolColor = getSchoolColor(school.bentuk_pendidikan);

  return (
    <Popup className="rounded-xl min-w-[280px]">
      <div className="text-sm font-sans -mx-3 -my-2">
        <div className={`${schoolColor.base} p-3 -mt-2 -mx-2 rounded-t-lg relative`}>
          <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-medium bg-black/20 text-white rounded-bl-lg">
            {school.bentuk_pendidikan}
          </div>
          <h2 className="font-bold text-base text-white leading-tight pr-12">{school.nama}</h2>
          <button 
            onClick={() => setExpandedAddress(!expandedAddress)}
            className="text-xs text-white/70 mt-1 hover:text-white transition-colors text-left w-full cursor-pointer"
          >
            <p className={expandedAddress ? '' : 'line-clamp-1'}>
              {school.alamat}
            </p>
          </button>
        </div>
        
        <div className="p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-neutral-400">NPSN</div>
              <div className="font-medium">{school.npsn}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Status</div>
              <div className="font-medium">{school.status}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-400">Akreditasi</div>
            <div className={`px-3 py-1 text-xs font-medium bg-gradient-to-r ${
              getAkreditasiGradient(school.akreditasi)
            } text-white rounded-full`}>
              {school.akreditasi}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 mt-2 border-t border-neutral-800/50">
            <div className="text-center">
              <div className={`text-2xl font-bold ${schoolColor.number}`}>
                {school.jumlah_guru}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                Guru
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${schoolColor.number}`}>
                {school.jumlah_murid}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                Murid
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}