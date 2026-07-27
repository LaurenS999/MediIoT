import "./LampiranPemeriksaan.css";

export default function LampiranPemeriksaan({
  lampiran = [],
  setPreviewImage,
}) {
  if (lampiran.length === 0) {
    return null;
  }

  const groupedLampiran = lampiran.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = [];
    }

    acc[item.kategori].push(item);

    return acc;
  }, {});

  return (
    <div className="doctor-card">
      <h2>Lampiran Tambahan</h2>

      {Object.entries(groupedLampiran).map(([kategori, items]) => (
        <div key={kategori} className="lampiran-section">
          <h3 className="lampiran-title">
            {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
          </h3>

          <div className="lampiran-grid">
            {items.map((item) => {
              const isImage = /\.(jpg|jpeg|png|webp)$/i.test(item.nama_file);

              return (
                <div key={item.id_lampiran} className="lampiran-card">
                  <div className="lampiran-preview">
                    {isImage ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/kunjungan/${item.path_file}`}
                        alt={item.nama_file}
                        className="lampiran-thumbnail"
                        onClick={() => setPreviewImage(item)}
                      />
                    ) : (
                      <iframe
                        src={`${process.env.REACT_APP_API_URL}/uploads/kunjungan/${item.path_file}`}
                        title={item.nama_file}
                      />
                    )}
                  </div>

                  <div className="lampiran-info">
                    <span>{item.nama_file}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
