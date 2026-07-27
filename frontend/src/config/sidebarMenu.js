import {
  ChartBar,
  Users,
  Activity,
  Smartphone,
  ScrollText,
  Stethoscope,
} from "lucide-react";

export const sidebarMenu = [
  {
    label: "Pemeriksaan Awal",
    path: "/setup-kunjungan",
    icon: ChartBar,

    roles: ["admin", "perawat", "super admin"],
  },
  {
    label: "Pemeriksaan Dokter",
    path: "/pemeriksaan-dokter",
    icon: Stethoscope,

    roles: ["dokter", "super admin"],
  },

  {
    label: "Pasien",
    path: "/pasien",
    icon: Users,

    roles: ["dokter", "perawat", "super admin"],
  },

  {
    label: "Data Pasien",
    path: `/rekam-medis-saya`,
    icon: Users,
    roles: ["pasien", "super_admin"],
  },

  // {
  //   label: "Pendaftaran",
  //   path: `/pendaftaran`,
  //   icon: ScrollText,
  //   roles: ["perawat", "super admin", "pasien"],
  // },

  {
    label: "Riwayat Kunjungan",
    path: "/riwayat-kunjungan",
    icon: Activity,

    roles: ["dokter", "perawat", "super admin"],
  },

  {
    label: "Alat Kesehatan",
    path: "/alat-kesehatan",
    icon: Smartphone,

    roles: ["admin", "super admin"],
  },
  {
    label: "Manajemen User",
    path: "/user",
    icon: Users,
    roles: ["admin", "super admin"],
  },
];
