document.getElementById("saveFileBtn").addEventListener("click", () => {
    const loader = document.getElementById("loader");

    const messages = [
        "Termine werden verschlüsselt...",
        "Daten werden gesichert...",
        "Folge @Planify auf Instagramm",
        "Magische Ereignisse verpacken sich...",
        "Datei wird erstellt...",
        "Folge @maas1160 auf Instagramm"
    ];
    document.querySelector("#loader p").textContent = messages[Math.floor(Math.random() * messages.length)];
    loader.classList.remove("hidden");

    setTimeout(() => {
        const plain = JSON.stringify(localStorage);
        const encoded = btoa(plain); // Base64 kodieren

        const blob = new Blob([encoded], { type: "application/planify+base64" });

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:]/g, "-").slice(0, 16);
        const filename = `Planify_${timestamp}.pfy`;

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);

        setTimeout(() => {
            localStorage.clear();
            loader.classList.add("hidden");
        }, 500);
    }, 1000);
});


document.getElementById("loadFileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const encoded = reader.result;
            const decoded = atob(encoded); // Base64 zurückwandeln
            const data = JSON.parse(decoded);

            for (let key in data) {
                localStorage.setItem(key, data[key]);
            }

            alert("🎉 Datei erfolgreich geladen!");
            location.reload();
        } catch (e) {
            alert("⚠️ Fehler beim Laden der Datei. Ist es wirklich eine gültige Planify-Datei?");
        }
    };

    reader.readAsText(file);
});

document.getElementById("clearStorageBtn").addEventListener("click", () => {
    if (confirm("Bist du sicher, dass du alle gespeicherten Daten löschen willst?")) {
        localStorage.clear();
        alert("Deine Daten wurden gelöscht!");
        location.reload(); // Seite neu laden, um Effekt zu sehen
    }
});

document.getElementById('check-sw-btn').addEventListener('click', async () => {
    if (!('serviceWorker' in navigator)) {
        showSWStatus('❌ Dein Browser unterstützt keine Service Worker.', true);
        return;
    }

    try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
            showSWStatus('⚠️ Kein Service Worker registriert.', true);
        } else if (reg.installing) {
            showSWStatus('🔄 Service Worker wird gerade installiert...');
        } else if (reg.waiting) {
            showSWStatus('⏳ Service Worker wartet auf Aktivierung...');
        } else if (reg.active) {
            showSWStatus('✅ Service Worker ist aktiv!');
        } else {
            showSWStatus('🤔 Service Worker-Zustand unbekannt.', true);
        }
    } catch (err) {
        showSWStatus('❌ Fehler beim Abrufen des Service Worker-Status.', true);
        console.error(err);
    }
});

function showSWStatus(message, isError = false) {
    const box = document.getElementById('sw-status');
    box.textContent = message;
    box.style.backgroundColor = isError ? '#ffecec' : '#eef5ec';
    box.style.color = isError ? '#a94442' : '#1b512d';

    box.classList.remove('hidden');

    // Nach 3 Sekunden ausblenden
    setTimeout(() => {
        box.classList.add('hidden');
    }, 3000);
}
