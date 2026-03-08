const s3Key = "videos/1772669228113-test-video-2.mp4.mp4";

// 18 dummy base64 frames 
const frames = Array.from({ length: 18 }, (_, i) => ({
    timestamp: i,
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
}));

async function run() {
    console.log("Starting analysis API call with 18 frames...");
    try {
        const res = await fetch("http://localhost:3000/api/analyze-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                s3Key,
                durationSeconds: 15,
                frames,
                category: "General"
            })
        });
        const data = await res.json();
        console.log("Result success:", data.success);
        console.log(`Total intervals in timeline logic generated scenes: ${data.totalScenes}`);
        if (data.scenes) {
            console.log("Total scenes count:", data.scenes.length);
        }
    } catch (err) {
        console.error("API error", err);
    }
}

run();
