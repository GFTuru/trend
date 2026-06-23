const videoElement = document.getElementById('webcam');
const statusText = document.getElementById('status');

// Konfigurasi AI Deteksi Tangan (MediaPipe)
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1, // Deteksi 1 tangan aja cukup
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

// Logika ketika AI berhasil mendeteksi tangan
hands.onResults((results) => {
    // Kalau ada tangan di layar
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // Titik penting pada jari (y koordinat: semakin kecil nilainya, semakin di atas)
        // Telunjuk (Index)
        const isIndexUp = landmarks[8].y < landmarks[6].y; 
        // Jari Tengah (Middle)
        const isMiddleUp = landmarks[12].y < landmarks[10].y; 
        // Jari Manis (Ring)
        const isRingDown = landmarks[16].y > landmarks[14].y; 
        // Kelingking (Pinky)
        const isPinkyDown = landmarks[20].y > landmarks[18].y; 

        // Cek Pose "2" (Peace) ✌️
        // Telunjuk & tengah NAIK, manis & kelingking TURUN
        if (isIndexUp && isMiddleUp && isRingDown && isPinkyDown) {
            videoElement.classList.add('blur-active');
            statusText.innerText = "Pose ✌️ Terdeteksi! Layar Nge-blur~";
        } else {
            videoElement.classList.remove('blur-active');
            statusText.innerText = "Tangan terdeteksi. Ayo pose ✌️!";
        }
    } else {
        // Kalau ga ada tangan di layar
        videoElement.classList.remove('blur-active');
        statusText.innerText = "Mana tanganmu? Tunjukin ke kamera ya!";
    }
});

// Menyalakan Kamera Webcam
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 320,
    height: 480
});

// Mulai kamera dan ubah teks status
camera.start().then(() => {
    statusText.innerText = "Kamera nyala! Siap pose ✌️";
});