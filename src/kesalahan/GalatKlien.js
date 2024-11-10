class GalatKlien extends Error {
  constructor(pesan, kodeStatus = 400) {
    super(pesan);
    this.kodeStatus = kodeStatus;
    this.nama = 'GalatKlien';
  }
}

export default GalatKlien;