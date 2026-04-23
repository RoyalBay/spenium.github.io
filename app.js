let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users") || "{}");

function save(){
  localStorage.setItem("users", JSON.stringify(users));
}

/* VERIFIED BADGE (RESTORED) */
function verified(u){
  return (users[u]?.followers?.length || 0) >= 100 ? " ◆" : "";
}

/* FOLLOW (unchanged core) */
function follow(user){
  if(!users[user]) return;

  users[user].followers ||= [];

  if(users[user].followers.includes(currentUser)){
    users[user].followers = users[user].followers.filter(x => x !== currentUser);
  } else {
    users[user].followers.push(currentUser);
  }

  save();
  load();
}

/* CLICK PROFILE → LEFT PANEL (FIXED BEHAVIOR) */
function openProfile(user){
  let u = users[user];
  if(!u) return;

  leftProfile.style.display = "block";
  leftPic.src = u.pic || "";
  leftName.innerHTML = "<b>@"+user+"</b>" + verified(user);
  leftFollowers.innerText = "Followers: " + u.followers.length;
}

/* POST */
function post(){
  if(!text.value.trim()) return;

  users[currentUser].posts.unshift({
    id: Date.now(),
    user: currentUser,
    text: text.value,
    time: new Date().toLocaleString(),
    likes: 0,
    likedBy: []
  });

  save();
  text.value = "";
  load();
}

/* LIKE */
function like(id){
  for(let u in users){
    for(let p of users[u].posts){
      if(p.id === id){

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
  load();
}

/* DELETE */
function del(id){
  users[currentUser].posts =
    users[currentUser].posts.filter(p => p.id !== id);

  save();
  load();
}

/* PROFILE PIC */
function uploadPic(file){
  if(!file) return;

  let r = new FileReader();
  r.onload = () => {
    users[currentUser].pic = r.result;
    save();
    load();
  };
  r.readAsDataURL(file);
}
