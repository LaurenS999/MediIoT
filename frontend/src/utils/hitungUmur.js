export function hitungUmur(tanggalLahir) {
    if (!tanggalLahir) return "-";

    const today = new Date();
    const birthDate = new Date(tanggalLahir);

    if (isNaN(birthDate)) return "-";

    let umur = today.getFullYear() - birthDate.getFullYear();

    const bulan = today.getMonth() - birthDate.getMonth();

    if (
      bulan < 0 ||
      (bulan === 0 && today.getDate() < birthDate.getDate())
    ) {
      umur--;
    }

    return umur;
  }