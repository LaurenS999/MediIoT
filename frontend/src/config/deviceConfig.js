import { Scale, Thermometer, HeartPulse } from "lucide-react";

import CardBMI from "../components/devices/CardBMI";
import CardOxy from "../components/devices/CardOxi";
import CardTensi from "../components/devices/CardTensi";
import CardTermometer from "../components/devices/CardTermometer";
import CardTimbanganBayi from "../components/devices/CardTimbanganBayi";
import CardTimbanganIbuBayi from "../components/devices/CardIDA";

export const deviceConfig = {
  digitpro_baby: {
    icon: Scale,
    label: "Timbangan Bayi",
    component: CardTimbanganBayi,
  },

  digitpro_bmi: {
    icon: Scale,
    label: "Timbangan BMI",
    component: CardBMI,
  },
  digitpro_ida: {
    icon: Scale,
    label: "Timbangan IDA",
    component: CardTimbanganIbuBayi,
  },

  pulse_oximeter: {
    icon: Scale,
    label: "OxyMeter",
    component: CardOxy,
  },

  tensione: {
    icon: HeartPulse,
    label: "Tensi Darah",
    component: CardTensi,
  },

  mft01: {
    icon: Thermometer,
    label: "Thermometer",
    component: CardTermometer,
  },
};
