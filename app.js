
/* =========================
   GLOBAL STATE
========================= */

let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users") || "{}");

function save(){
  localStorage.setItem("users", JSON.stringify(users));
}

/* =========================
   SAFE INIT (PREVENT BREAKS)
========================= */

function ensureUser(u){
  if(!users[u]) return;

  users[u].followers ||= [];
  users[u].posts ||= [];
  users[u].pic ||= "";
}

/* =========================
   VERIFIED BADGE
========================= */

function verified(u){
  return (users[u]?.followers?.length || 0) >= 100 ? " ◆" : "";
}

/* =========================
   FOLLOW / UNFOLLOW (FIXED)
========================= */

function follow(user){
  if(!users[user] || !currentUser) return;

  ensureUser(user);

  let list = users[user].followers;

  if(list.includes(currentUser)){
    users[user].followers = list.filter(x => x !== currentUser);
  } else {
    users[user].followers.push(currentUser);
  }

  save();
  render();
  updateSideProfile(user);
}

/* =========================
   LIKE SYSTEM (TOGGLE FIXED)
========================= */

function like(postId){
  for(let u in users){
    let posts = users[u].posts;

    for(let p of posts){
      if(p.id === postId){

        p.likedBy ||= [];

        if(p.likedBy.includes(currentUser)){
          p.likedBy = p.likedBy.filter(x => x !== currentUser);
        } else {
          p.likedBy.push(currentUser);
        }

        p.likes = p.likedBy.length;
      }
    }
  }

  save();
  render();
}

/* =========================
   DELETE POST
========================= */

function del(postId){
  let me = users[currentUser];
  if(!me) return;

  me.posts = me.posts.filter(p => p.id !== postId);

  save();
  render();
}

/* =========================
   CREATE POST
========================= */

function post(){
  let text = document.getElementById("text");
  if(!text.value.trim()) return;

  let me = users[currentUser];
  if(!me) return;

  me.posts.unshift({
    id: Date.now(),
    user: currentUser,
    text: text.value,
    time: new Date().toLocaleString(),
    likes: 0,
    likedBy:[]
  });

  save();
  text.value = "";
  render();
}

/* =========================
   PROFILE PICTURE UPLOAD
========================= */

function uploadPic(file){
  if(!file || !currentUser) return;

  let reader = new FileReader();

  reader.onload = () => {
    users[currentUser].pic = reader.result;
    save();
    render();
  };

  reader.readAsDataURL(file);
}

/* =========================
   PROFILE VIEW (RIGHT PANEL)
========================= */

function updateSideProfile(user){
  if(!users[user]) return;

  let u = users[user];

  let img = document.getElementById("rightPic");
  let name = document.getElementById("rightName");
  let fol = document.getElementById("rightFollowers");

  if(img) img.src = u.pic || "";

  if(name){
    name.innerHTML = "<b>@"+user+"</b>" + verified(user);
  }

  if(fol){
    fol.innerText = "Followers: " + (u.followers?.length || 0);
  }
}

/* =========================
   LEFT POPUP PROFILE (IF USED)
========================= */

function openProfile(user){
  if(!users[user]) return;

  let u = users[user];

  let box = document.getElementById("leftProfile");
  if(!box) return;

  box.style.display = "block";

  document.getElementById("leftPic").src = u.pic || "";
  document.getElementById("leftName").innerHTML =
    "<b>@"+user+"</b>" + verified(user);

  document.getElementById("leftFollowers").innerText =
    "Followers: " + (u.followers?.length || 0);
}

/* =========================
   THEME SYSTEM (FIXED GLOBAL APPLY)
========================= */

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

/* =========================
   MAIN RENDER ENGINE
========================= */

function render(){
  applyTheme();

  let feed = document.getElementById("posts");
  if(!feed) return;

  feed.innerHTML = "";

  let all = [];

  for(let u in users){
    ensureUser(u);
    all.push(...users[u].posts);
  }

  all.sort((a,b)=>b.id-a.id);

  all.forEach(p=>{
    let owner = users[p.user];
    if(!owner) return;

    let div = document.createElement("div");
    div.className = "post";

    let isFollowing = owner.followers.includes(currentUser);

    div.innerHTML = `
      <span class="user" onclick="openProfile('${p.user}')">
        @${p.user}${verified(p.user)}
      </span>

      <button onclick="follow('${p.user}')">
        ${isFollowing ? "Unfollow" : "Follow"}
      </button>

      <div>${p.text}</div>

      <div style="font-size:11px;color:gray;">
        ${p.time || ""}
      </div>

      <div onclick="like(${p.id})">
        ▲ ${p.likes || 0}
      </div>

      ${p.user === currentUser ?
        `<div class="delete" onclick="del(${p.id})">delete</div>` : ""}
    `;

    feed.appendChild(div);
  });

  if(currentUser && users[currentUser]){
    updateSideProfile(currentUser);
  }
}

/* =========================
   INIT SAFETY RUN
========================= */

if(currentUser && users[currentUser]){
  ensureUser(currentUser);
}
