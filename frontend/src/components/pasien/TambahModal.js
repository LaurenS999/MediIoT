export default function ModalTambahPasien({
  isOpen,
  onClose,
  onSave,
  newPasien,
  setNewPasien,
  errors,
  seterror,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Tambah Pasien</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-form">
          {/* Nama */}
          <div className="form-group">
            <label>
              Nama Lengkap <span className="required">*</span>
            </label>

            <input
              type="text"
              className={errors.nama ? "input-error" : ""}
              placeholder="Masukkan nama pasien"
              value={newPasien.nama}
              onChange={(e) => {
                setNewPasien({
                  ...newPasien,
                  nama: e.target.value,
                });

                seterror((prev) => ({
                  ...prev,
                  nama: false,
                }));
              }}
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="form-group">
            <label>
              Jenis Kelamin <span className="required">*</span>
            </label>

            <select
              className={errors.jenis_kelamin ? "input-error" : ""}
              value={newPasien.jenis_kelamin}
              onChange={(e) => {
                setNewPasien({
                  ...newPasien,
                  jenis_kelamin: e.target.value,
                });

                seterror((prev) => ({
                  ...prev,
                  jenis_kelamin: false,
                }));
              }}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Tempat Lahir */}
          <div className="form-group">
            <label>Tempat Lahir</label>

            <input
              type="text"
              placeholder="Contoh: Surabaya"
              value={newPasien.tempat_lahir}
              onChange={(e) =>
                setNewPasien({
                  ...newPasien,
                  tempat_lahir: e.target.value,
                })
              }
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="form-group">
            <label>
              Tanggal Lahir <span className="required">*</span>
            </label>

            <input
              type="date"
              className={errors.tanggal_lahir ? "input-error" : ""}
              value={newPasien.tanggal_lahir}
              onChange={(e) => {
                setNewPasien({
                  ...newPasien,
                  tanggal_lahir: e.target.value,
                });
                seterror((prev) => ({
                  ...prev,
                  tanggal_lahir: false,
                }));
              }}
            />
          </div>

          {/* No Telepon */}
          <div className="form-group">
            <label>No Telepon</label>

            <input
              type="text"
              placeholder="08xxxxxxxxxx"
              value={newPasien.no_telp}
              onChange={(e) =>
                setNewPasien({
                  ...newPasien,
                  no_telp: e.target.value,
                })
              }
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="contoh@email.com"
              value={newPasien.email}
              onChange={(e) =>
                setNewPasien({
                  ...newPasien,
                  email: e.target.value,
                })
              }
            />
          </div>

          {/* Alamat */}
          <div className="form-group full-width">
            <label>
              Alamat <span className="required">*</span>
            </label>

            <textarea
              rows="3"
              placeholder="Masukkan alamat lengkap pasien"
              className={errors.alamat ? "input-error" : ""}
              value={newPasien.alamat}
              onChange={(e) => {
                setNewPasien({
                  ...newPasien,
                  alamat: e.target.value,
                });
                seterror((prev) => ({
                  ...prev,
                  alamat: false,
                }));
              }}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>

            <button type="button" className="btn-primary" onClick={onSave}>
              Simpan Pasien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
