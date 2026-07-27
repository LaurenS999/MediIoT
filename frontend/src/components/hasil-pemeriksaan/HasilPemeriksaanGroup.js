import "../../styles/hasilPemeriksaan.css";

export default function HasilPemeriksaanGroup({ title, children }) {
  return (
    <section className="hasil-group">
      <div className="hasil-group-header">
        <h3>{title}</h3>
      </div>

      <div className="hasil-group-grid">{children}</div>
    </section>
  );
}
