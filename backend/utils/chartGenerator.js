const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// ======================================================
// CONFIG
// ======================================================

const width = 1000;
const height = 450;

const chartCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",
});

// ======================================================
// GENERATE LINE CHART
// ======================================================

async function generateLineChart({ title, labels, datasets, yAxisTitle = "" }) {
  const configuration = {
    type: "line",

    data: {
      labels,

      datasets,
    },

    options: {
      responsive: false,

      plugins: {
        legend: {
          position: "top",

          labels: {
            color: "#111827",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },

      // Tambahkan ini
      scales: {
        x: {
          ticks: {
            color: "#111827",
            font: {
              size: 16,
              weight: "bold",
            },
          },

          title: {
            display: true,
            text: "Tanggal Pemeriksaan",
            color: "#111827",
            font: {
              size: 16,
              weight: "bold",
            },
          },

          border: {
            color: "#000",
            width: 2,
          },
        },

        y: {
          ticks: {
            color: "#111827",
            font: {
              size: 16,
              weight: "bold",
            },
          },

          title: {
            display: true,
            text: "kg",
            color: "#111827",
            font: {
              size: 16,
              weight: "bold",
            },
          },

          border: {
            color: "#000",
            width: 2,
          },
        },
      },
    },
  };

  return await chartCanvas.renderToBuffer(configuration);
}

// ======================================================
// BERAT BADAN
// ======================================================

async function generateWeightChart(rows) {
  const filteredRows = rows.filter(
    (item) => item.berat !== null && item.berat !== "",
  );

  const labels = filteredRows.map((item) => {
    const date = new Date(item.dibuat_pada);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  });

  const data = filteredRows.map((item) => Number(item.berat));

  return generateLineChart({
    title: "Trend Berat Badan",

    labels,

    yAxisTitle: "kg",

    datasets: [
      {
        label: "Berat Badan",

        data,

        borderColor: "#2563EB",

        backgroundColor: "#2563EB",

        borderWidth: 3,

        tension: 0.3,

        fill: false,
      },
    ],
  });
}

// ======================================================
// BODY FAT
// ======================================================

async function generateBodyFatChart(rows) {
  const filteredRows = rows.filter(
    (item) => item.body_fat !== null && item.body_fat !== "",
  );

  const labels = filteredRows.map((item) => {
    const date = new Date(item.dibuat_pada);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  });

  const data = filteredRows.map((item) => Number(item.body_fat));

  return generateLineChart({
    title: "Trend Body Fat",

    labels,

    yAxisTitle: "%",

    datasets: [
      {
        label: "Body Fat",

        data,

        borderColor: "#EF4444",

        backgroundColor: "#EF4444",

        borderWidth: 3,

        tension: 0.3,

        fill: false,
      },
    ],
  });
}

// ======================================================
// MUSCLE MASS
// ======================================================

async function generateMuscleChart(rows) {
  const filteredRows = rows.filter(
    (item) => item.muscle_mass !== null && item.muscle_mass !== "",
  );

  const labels = filteredRows.map((item) => {
    const date = new Date(item.dibuat_pada);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  });

  const data = filteredRows.map((item) => Number(item.muscle_mass));

  return generateLineChart({
    title: "Trend Muscle Mass",

    labels,

    yAxisTitle: "kg",

    datasets: [
      {
        label: "Muscle Mass",

        data,

        borderColor: "#10B981",

        backgroundColor: "#10B981",

        borderWidth: 3,

        tension: 0.3,

        fill: false,
      },
    ],

    scales: {
      x: {
        ticks: {
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        title: {
          display: true,
          text: "Tanggal Pemeriksaan",
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        border: {
          color: "#000",
          width: 2,
        },
      },

      y: {
        ticks: {
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        title: {
          display: true,
          text: "kg",
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        border: {
          color: "#000",
          width: 2,
        },
      },
    },
  });
}

// ======================================================
// TEKANAN DARAH
// ======================================================

async function generateBloodPressureChart(rows) {
  const labels = [...rows]
    .reverse()
    .map((item) => new Date(item.dibuat_pada).toLocaleDateString("id-ID"));

  const systolic = [...rows].reverse().map((item) => {
    if (!item.tekanan_darah) return null;

    return Number(item.tekanan_darah.split("/")[0]);
  });

  const diastolic = [...rows].reverse().map((item) => {
    if (!item.tekanan_darah) return null;

    return Number(item.tekanan_darah.split("/")[1]);
  });

  return generateLineChart({
    title: "Trend Tekanan Darah",

    labels,

    yAxisTitle: "mmHg",

    datasets: [
      {
        label: "Systolic",

        data: systolic,

        borderColor: "#DC2626",

        backgroundColor: "#DC2626",

        borderWidth: 3,

        tension: 0.3,
      },

      {
        label: "Diastolic",

        data: diastolic,

        borderColor: "#2563EB",

        backgroundColor: "#2563EB",

        borderWidth: 3,

        tension: 0.3,
      },
    ],

    scales: {
      x: {
        ticks: {
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        title: {
          display: true,
          text: "Tanggal Pemeriksaan",
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        border: {
          color: "#000",
          width: 2,
        },
      },

      y: {
        ticks: {
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        title: {
          display: true,
          text: "kg",
          color: "#111827",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        border: {
          color: "#000",
          width: 2,
        },
      },
    },
  });
}

// ======================================================

module.exports = {
  generateWeightChart,

  generateBloodPressureChart,

  generateBodyFatChart,

  generateMuscleChart,
};
