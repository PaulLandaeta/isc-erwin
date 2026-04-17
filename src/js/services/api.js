export async function submitVocationalTest(payload) {
    const WEBHOOK_URL = "https://hectorpers.app.n8n.cloud/webhook/38f91f9b-c8c9-451e-9fc5-5adca03a4716";

    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("No se pudo procesar el test.");
    }

    return response.json();
}