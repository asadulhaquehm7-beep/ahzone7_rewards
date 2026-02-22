const tg = Telegram.WebApp;
let points = 0;
let dailyUsed = false;

function update(p){
  points += p;
  document.getElementById("points").innerText = points;
}

function mine(){ update(1); }
function spin(){ update(Math.floor(Math.random()*10)); }
function lucky(){
  if(Math.random()>0.7) update(20);
}
function scratch(){
  update([0,2,5,10][Math.floor(Math.random()*4)]);
}
function daily(){
  if(dailyUsed) return alert("Already claimed");
  dailyUsed = true;
  update(15);
}
function withdraw(){
  fetch("/withdraw",{
    method:"POST",
    body:JSON.stringify({ user:tg.initDataUnsafe.user.id, points })
  });
  alert("Withdraw request sent");
}
