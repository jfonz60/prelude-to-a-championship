const $=s=>document.querySelector(s);
let activeTeam=null;

function matchup(team){
  for(const d of EVENT_DATA.schedule){
    for(const g of d.games){
      if(g.teams.includes(team)){
        const opp=g.teams.find(t=>t!==team);
        return `${d.day}, ${d.date} · ${g.time} ET · vs. ${opp}`;
      }
    }
  }
  return "";
}

function renderSchedule(){
  $("#scheduleList").innerHTML=EVENT_DATA.schedule.map(d=>`
    <article class="day">
      <div class="day-head"><strong>${d.day}</strong><span>${d.date}, 2026</span></div>
      ${d.games.map(g=>`<div class="game"><div class="game-time">${g.time}</div><div class="game-teams">${g.teams[0]} <span style="color:#718293;font-weight:700">vs.</span> ${g.teams[1]}</div></div>`).join("")}
    </article>`).join("");
}

function renderTeams(q=""){
  const term=q.trim().toLowerCase();
  const teams=Object.keys(EVENT_DATA.rosters).filter(t=>t.toLowerCase().includes(term));
  $("#teamGrid").innerHTML=teams.map(t=>`
    <button class="team-card" data-team="${t}">
      <strong>${t}</strong>
      <small>${matchup(t)}<br>${EVENT_DATA.rosters[t].length} players listed</small>
    </button>`).join("");
  document.querySelectorAll("[data-team]").forEach(b=>b.onclick=()=>openRoster(b.dataset.team));
}

function renderRoster(q=""){
  const term=q.trim().toLowerCase();
  const rows=EVENT_DATA.rosters[activeTeam].filter(r=>{
    return !term || [r.number,r.player,r.position,r.grade].join(" ").toLowerCase().includes(term);
  });
  $("#rosterBody").innerHTML=rows.map(r=>`<tr><td>${r.number}</td><td>${r.player}</td><td>${r.position||"—"}</td><td>${r.grade||"—"}</td></tr>`).join("");
  $("#rosterCount").textContent=`${rows.length} of ${EVENT_DATA.rosters[activeTeam].length} players`;
}

function openRoster(team){
  activeTeam=team;
  $("#teamName").textContent=team;
  $("#matchup").textContent=matchup(team);
  $("#playerSearch").value="";
  renderRoster();
  $("#rosterDialog").showModal();
}

document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go).scrollIntoView({behavior:"smooth"}));
$("#teamSearch").oninput=e=>renderTeams(e.target.value);
$("#playerSearch").oninput=e=>renderRoster(e.target.value);
$("#closeDialog").onclick=()=>$("#rosterDialog").close();
$("#rosterDialog").addEventListener("click",e=>{if(e.target===$("#rosterDialog"))$("#rosterDialog").close();});
renderSchedule();renderTeams();


