// Sub-komponen untuk POIN 3 (Tampilan Profil)
export default function PasienProfile({ label, value }) {
  return (
    <div className="profile-item">
      <label className="profile-label">{label}</label>
      <div className={`profile-value ${!value ? 'empty' : ''}`}>
        {value || "-"}
      </div>
    </div>
  );
}