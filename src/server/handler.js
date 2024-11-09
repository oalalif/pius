const { storeData, getHistories } = require("../services/firestore-service");
const predictClassification = require("../services/inferenceService");
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        // Validasi ukuran file (misalnya batas 1MB)
        if (image && image._data.length > 1000000) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413);
        }

        // Lakukan prediksi
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);

        // Buat ID unik dan timestamp
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Persiapkan data untuk disimpan
        const data = {
            id: id,
            result: label,
            suggestion: suggestion,
            confidenceScore: confidenceScore,
            createdAt: createdAt
        };

        // Simpan data ke database
        await storeData(id, data);

        // Kembalikan respons sukses
        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });

        response.code(201);
        return response;
        
    } catch (error) {
        console.error("Error during prediction:", error);  // Logging error

        // Kembalikan respons gagal jika terjadi error
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi. Silakan coba lagi.'
        }).code(500); // Menggunakan 500 untuk error server
    }
}
