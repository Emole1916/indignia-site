let seciliStage = 0;
let rpm = 0;

/* LOADING + SCROLL */
window.onload = () => {
    document.querySelectorAll(".card").forEach(c => c.classList.add("show"));

    let s = localStorage.getItem("stage");
    let t = localStorage.getItem("tema");

    if (s) seciliStage = parseInt(s);
    if (t === "light") document.body.classList.add("light");
};

/* STAGE */
function stageSec(stage) {
    seciliStage = stage;
    localStorage.setItem("stage", stage);
    document.getElementById("sonuc").innerText = "Stage " + stage + " seçildi";

    document.querySelectorAll(".stage button")
        .forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
}

/* MOD */
function modifiyeBaslat() {
    toastGoster("Modifiye başlatıldı");

    rpm = 0;
    let hiz = 0;

    let rpmInt = setInterval(() => {
        if (rpm >= 100) {
            clearInterval(rpmInt);
        } else {
            rpm += 5;
            document.getElementById("rpmBar").style.width = rpm + "%";

            if (rpm > 70)
                document.getElementById("alev").classList.add("active");
            else
                document.getElementById("alev").classList.remove("active");

            if (rpm >= 90) toastGoster("⚠️ Devir limiti!");
        }
    }, 150);

    let hizInt = setInterval(() => {
        if (hiz >= 240) {
            clearInterval(hizInt);
        } else {
            hiz += seciliStage === 1 ? 4 : 6;
            document.getElementById("hiz").innerText = hiz;
            document.getElementById("bar").style.width = (hiz / 2) + "%";
            grafikCiz(hiz);
        }
    }, 120);
}

/* TOAST */
function toastGoster(m) {
    let t = document.getElementById("toast");
    t.innerText = m;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
}

/* TEMA */
function temaDegistir() {
    document.body.classList.toggle("light");
    localStorage.setItem(
        "tema",
        document.body.classList.contains("light") ? "light" : "dark"
    );
}

/* FULLSCREEN */
function tamEkran() {
    if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
    else
        document.exitFullscreen();
}

/* CANVAS GRAPH */
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
let x = 0, y = 140;

function grafikCiz(h) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(x, y);
    x += 3;
    y = 140 - h / 2;
    ctx.lineTo(x, y);
    ctx.stroke();
}

/* KLAVYE */
document.addEventListener("keydown", e => {
    if (e.key === "w" || e.key === "ArrowUp") modifiyeBaslat();
    if (e.key === "a") direksiyon(-20);
    if (e.key === "d") direksiyon(20);
    if (e.key === "F2") debugToggle();
});

document.addEventListener("keyup", () => direksiyon(0));

function direksiyon(deg) {
    document.getElementById("direksiyon")
        .style.transform = `rotate(${deg}deg)`;
}

/* DEBUG */
function debugToggle() {
    let d = document.getElementById("debug");
    d.style.display = d.style.display === "none" ? "block" : "none";
}

setInterval(() => {
    document.getElementById("dStage").innerText = seciliStage;
    document.getElementById("dRpm").innerText = rpm;
    document.getElementById("dHiz").innerText =
        document.getElementById("hiz").innerText;
}, 200);
