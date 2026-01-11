let hiz = 0;
let rpm = 0;
let sicaklik = 70;
let gaz = false;
let offset = 0;
let day = true;

const araba = document.getElementById("araba");
const yol = document.getElementById("yol");
const motorSes = document.getElementById("motorSes");
const farlar = document.querySelectorAll(".far");
const stoplar = document.querySelectorAll(".stop");
const neon = document.querySelector(".neon");

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" || e.key === "w") {
        gaz = true;
        motorSes.currentTime = 0;
        motorSes.play().catch(()=>{});
    }
    if (e.key === "ArrowLeft") move(-20);
    if (e.key === "ArrowRight") move(20);
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowUp" || e.key === "w") {
        gaz = false;
        motorSes.pause();
        stoplar.forEach(s => s.classList.add("active"));
        setTimeout(() => stoplar.forEach(s => s.classList.remove("active")), 300);
    }
});

let posX = window.innerWidth / 2 - 110;
function move(x) {
    posX += x;
    posX = Math.max(0, Math.min(window.innerWidth - 220, posX));
    araba.style.left = posX + "px";
}

function toggleDayNight() {
    day = !day;
    document.body.classList.toggle("night");
    if (!day) farlar.forEach(f => f.classList.add("acik"));
    else farlar.forEach(f => f.classList.remove("acik"));
}

function gameLoop() {
    if (gaz) {
        hiz += 1.2;
        rpm += 2;
        sicaklik += 0.3;

        neon.classList.add("active");
        farlar.forEach(f => f.classList.add("acik"));

        if (rpm > 70) document.getElementById("alev").classList.add("active");
    } else {
        hiz -= 1;
        rpm -= 3;
        neon.classList.remove("active");
        document.getElementById("alev").classList.remove("active");
    }

    hiz = Math.max(0, Math.min(240, hiz));
    rpm = Math.max(0, Math.min(100, rpm));

    document.getElementById("hiz").innerText = Math.floor(hiz);
    document.getElementById("rpmBar").style.width = rpm + "%";
    document.getElementById("sicaklik").innerText = Math.floor(sicaklik);

    offset += hiz / 5;
    yol.style.backgroundPositionY = offset + "px";

    requestAnimationFrame(gameLoop);
}

gameLoop();
