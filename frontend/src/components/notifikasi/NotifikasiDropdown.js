export default function NotifikasiDropdown({
  title,
  notifications,
  loading,
  ItemComponent,
  onItemClick,
  onSeeAll,
}) {
  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>{title}</h3>
      </div>

      {loading ? (
        <div className="notification-empty">Memuat...</div>
      ) : notifications.length === 0 ? (
        <div className="notification-empty">Tidak ada notifikasi.</div>
      ) : (
        <>
          <div className="notification-list">
            {notifications.map((item, index) => (
              <ItemComponent key={index} item={item} onClick={onItemClick} />
            ))}
          </div>

          <button className="notification-see-all" onClick={onSeeAll}>
            Lihat Semua
          </button>
        </>
      )}
    </div>
  );
}
