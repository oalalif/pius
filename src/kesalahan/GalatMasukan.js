import GalatKlien from './GalatKlien.js';

class GalatMasukan extends GalatKlien {
  constructor(pesan) {
    super(pesan);
    this.nama = 'GalatMasukan';
  }
}

export { GalatMasukan };