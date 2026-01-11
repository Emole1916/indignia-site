// Genel Değişkenler
let seciliStage=0,rpm=0,sicaklik=70,skor=0,maxSkor=0,gazBasili=false;
let startTime=null,tamamlandi=false;
let motorSes=document.getElementById("motorSes");
let araba=document.getElementById("araba");
let yol=document.getElementById("yol");
let engeller=[],rakipler=[];
let posX=window.innerWidth/2-30,offset=0;
let dayNight=true;

// Loading + Card Animasyonu
window.onload=()=>{
    document.querySelectorAll(".card").forEach(c=>c.classList.add("show"));
    let s=localStorage.getItem("stage"),t=localStorage.getItem("tema");
    if(s) seciliStage=parseInt(s);
    if(t==="light") document.body.classList.add("light");
};

// Stage Seçimi
function stageSec(stage){
    seciliStage=stage;
    localStorage.setItem("stage",stage);
    document.getElementById("sonuc").innerText="Stage "+stage+" seçildi";
}

// Modifiye Başlat
function modifiyeBaslat(){
    toastGoster("Modifiye Başlatıldı");
    rpm=0;
    if(!startTime) hizYarisiBaslat();
}

// Toast
function toastGoster(m){
    let t=document.getElementById("toast");
    t.innerText=m;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2000);
}

// Tema Toggle
function temaDegistir(){
    document.body.classList.toggle("light");
    localStorage.setItem("tema",document.body.classList.contains("light")?"light":"dark");
}

// Fullscreen
function tamEkran(){
    if(!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

// Gündüz/Gece Toggle
function toggleDayNight(){
    if(dayNight){document.body.classList.remove("day");document.body.classList.add("night");}
    else{document.body.classList.remove("night");document.body.classList.add("day");}
    dayNight=!dayNight;
}

// 0-100 km/h
function hizYarisiBaslat(){startTime=Date.now();tamamlandi=false;}
let hizInterval=setInterval(()=>{
    let hiz=parseInt(document.getElementById("hiz").innerText)||0;
    if(hiz>=100 && !tamamlandi){tamamlandi=true;let sure=((Date.now()-startTime)/1000).toFixed(2);document.getElementById("zaman").innerText=sure;toastGoster("🏁 0-100 km/h: "+sure+" sn");}
},100);

// Canvas Grafik
const canvas=document.getElementById("chart");const ctx=canvas.getContext("2d");
let x=0,y=140;
function grafikCiz(h){ctx.strokeStyle="lime";ctx.beginPath();ctx.moveTo(x,y);x+=3;y=140-h/2;ctx.lineTo(x,y);ctx.stroke();}

// Klavye Kontrolleri
document.addEventListener("keydown",e=>{
    const step=20;
    if(e.key==="ArrowLeft"||e.key==="a"){posX-=step;if(posX<0)posX=0;araba.style.left=posX+"px";}
    if(e.key==="ArrowRight"||e.key==="d"){posX+=step;if(posX>window.innerWidth-60)posX=window.innerWidth-60;araba.style.left=posX+"px";}
    if(e.key==="ArrowUp"||e.key==="w"){gazBasili=true;motorSes.currentTime=0;motorSes.play().catch(()=>{});modifiyeBaslat();}
});
document.addEventListener("keyup",e=>{if(e.key==="ArrowUp"||e.key==="w"){gazBasili=false;motorSes.pause();}});

// Direksiyon
function direksiyon(deg){document.getElementById("direksiyon").style.transform=`rotate(${deg}deg)`;}
document.addEventListener("keydown",e=>{if(e.key==="a") direksiyon(-20);if(e.key==="d") direksiyon(20);});
document.addEventListener("keyup",()=>direksiyon(0));

// Debug Paneli
function debugToggle(){let d=document.getElementById("debug");d.style.display=d.style.display==="none"?"block":"none";}
document.addEventListener("keydown",e=>{if(e.key==="F2") debugToggle();});
setInterval(()=>{
    document.getElementById("dStage").innerText=seciliStage;
    document.getElementById("dRpm").innerText=rpm;
    document.getElementById("dHiz").innerText=document.getElementById("hiz").innerText;
    document.getElementById("dSicaklik").innerText=sicaklik;
    document.getElementById("dSkor").innerText=skor;
},200);

// Gaz + RPM + Motor Sesi + Alev + Hız
function updateGame(){
    if(gazBasili){
        rpm+=4;if(rpm>100) rpm=100;
        motorSes.volume=rpm/100;
        document.getElementById("rpmBar").style.width=rpm+"%";
        if(rpm>70) document.getElementById("alev").classList.add("active"); else document.getElementById("alev").classList.remove("active");
        sicaklik+=rpm>80?2:0.5;
        if(sicaklik>=110) toastGoster("🔥 Motor aşırı ısındı!");
        document.getElementById("sicaklik").innerText=Math.min(sicaklik,120);
        // Sürüş modu
        let mod="ECO"; if(rpm>70) mod="SPORT"; if(rpm>90) mod="RACE";
        document.getElementById("surusModu").innerText="Sürüş Modu: "+mod;
        // Hız
        let hiz=parseInt(document.getElementById("hiz").innerText)||0;
        hiz+=seciliStage===1?4:6; if(hiz>240) hiz=240;
        document.getElementById("hiz").innerText=hiz;
        document.getElementById("bar").style.width=(hiz/2)+"%";
        grafikCiz(hiz);
    }else{
        if(rpm>0) rpm-=3;if(rpm<0) rpm=0;
        document.getElementById("rpmBar").style.width=rpm+"%";
    }

    // Yol hareketi
    if(gazBasili){
        let hız=seciliStage===1?10:16;
        offset+=hız;
        yol.style.backgroundPositionY=offset+"px";

        // Engeller
        engeller.forEach(e=>{
            let pos=parseInt(e.style.bottom);
            e.style.bottom=(pos-hız)+"px";
            if(pos<-120){e.remove();engeller.shift();skor+=10;document.getElementById("sonuc").innerText="Skor: "+skor;}
        });

        // Rakipler
        rakipler.forEach(r=>{
            let pos=parseInt(r.style.bottom);
            r.style.bottom=(pos-hız)+"px";
            if(pos<-120){r.remove();rakipler.shift();}
        });
    }

    // Kamera titreşim
    if(rpm>80) document.body.classList.add("shake"); else document.body.classList.remove("shake");

    requestAnimationFrame(updateGame);
}
updateGame();

// Engel oluştur
function engelOlustur(){
    let e=document.createElement("div"); e.classList.add("engel");
    e.style.left=Math.random()*(window.innerWidth-60)+"px";
    document.getElementById("engel-container").appendChild(e);
    e.style.bottom="400px"; engeller.push(e);
    setTimeout(()=>{if(e) e.remove();engeller.shift();},5000);
}
setInterval(()=>{if(gazBasili) engelOlustur();},1500);

// Rakip oluştur
function rakipOlustur(){
    let r=document.createElement("div"); r.classList.add("rakip");
    r.style.left=Math.random()*(window.innerWidth-60)+"px";
    document.getElementById("rakip-container").appendChild(r);
    r.style.bottom="400px"; rakipler.push(r);
    setTimeout(()=>{if(r) r.remove();rakipler.shift();},7000);
}
setInterval(()=>{if(gazBasili) rakipOlustur();},2000);

// Çarpışma kontrol
function carpismaKontrol(){
    engeller.concat(rakipler).forEach(obj=>{
        let a=araba.getBoundingClientRect(),b=obj.getBoundingClientRect();
        if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top){
            toastGoster("💥 Çarptın!");
            skor=0; document.getElementById("sonuc").innerText="Skor: "+skor;
        }
    });
    requestAnimationFrame(carpismaKontrol);
}
carpismaKontrol();

// Skor tablosu
setInterval(()=>{if(skor>maxSkor){maxSkor=skor;document.getElementById("maxSkor").innerText=maxSkor;}},500);

// Engeller ve rakipler için Stage farkı
