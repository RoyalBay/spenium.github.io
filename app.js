
/* FOLLOW FIX (FORCE STATE UPDATE + UI REFRESH) */
function follow(user){
  if(!users[user] || !currentUser) return;

  users[user].followers ||= [];

  let list = users[user].followers;

  if(list.includes(currentUser)){
    users[user].followers = list.filter(x => x !== currentUser);
  } else {
    users[user].followers.push(currentUser);
  }

  save();
  render();
}

/* THEME FIX (FORCE APPLY EVERY TIME PAGE RENDERS) */
function applyTheme(){
  let t = localStorage.getItem("theme") || "light";

  if(t === "light"){
    document.body.style.background = "#f5f6f7";
    document.body.style.color = "black";
  }

  if(t === "dark"){
    document.body.style.background = "#2b2b2b";
    document.body.style.color = "white";
  }

  if(t === "dynamic"){
    document.body.style.background =
      "linear-gradient(#3b5998,#8b9dc3)";
    document.body.style.color = "black";
  }
}

/* IMPORTANT: ALWAYS APPLY THEME INSIDE RENDER */
function render(){
  applyTheme();

  posts.innerHTML = "";

  let all = [];
  for(let u in users){
    all.push(...users[u].posts);
  }

  all.sort((a,b)=>b.id-a.id);

  all.forEach(p=>{
    let owner = users[p.user];
    if(!owner) return;

    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <span class="user" onclick="openProfile('${p.user}')">
        @${p.user}
      </span>

      <button onclick="follow('${p.user}')">
        ${owner.followers.includes(currentUser) ? "Unfollow" : "Follow"}
      </button>

      <div>${p.text}</div>

      <div style="font-size:11px;color:gray;">
        ${p.time || ""}
      </div>

      <div onclick="like(${p.id})">▲ ${p.likes || 0}</div>

      ${p.user===currentUser ?
        `<div class="delete" onclick="del(${p.id})">delete</div>` : ""}
    `;

    posts.appendChild(div);
  });

  let me = users[currentUser];

  rightPic.src = me.pic || "";
  rightName.innerHTML = "<b>@"+currentUser+"</b>";
  rightFollowers.innerText = "Followers: " + me.followers.length;
}
