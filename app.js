let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users") || "{}");

function save(){
  localStorage.setItem("users", JSON.stringify(users));
}

/* FOLLOW FIX (THIS WAS BREAKING BEFORE) */
function follow(user){
  if(!users[user]) return;

  users[user].followers ||= [];

  let list = users[user].followers;

  if(list.includes(currentUser)){
    users[user].followers = list.filter(x => x !== currentUser);
  } else {
    list.push(currentUser);
  }

  save();
  load();
}

/* POST */
function post(){
  if(!text.value.trim()) return;

  users[currentUser].posts.unshift({
    id: Date.now(),
    user: currentUser,
    text: text.value,
    time: new Date().toLocaleString(),   // FIX: timestamp restored
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
