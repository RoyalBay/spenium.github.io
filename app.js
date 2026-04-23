let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")||"{}");

function save(){
  localStorage.setItem("users",JSON.stringify(users));
}

function post(){
  let t=document.getElementById("text").value;
  if(!t) return;

  users[currentUser].posts.unshift({
    id:Date.now(),
    text:t,
    time:new Date().toLocaleString(),
    likes:0,
    likedBy:[]
  });

  save();
  render();
}

function render(){
  let feed=document.getElementById("posts");
  if(!feed) return;

  feed.innerHTML="";

  let posts=users[currentUser].posts;

  posts.forEach(p=>{
    let div=document.createElement("div");
    div.className="post";

    div.innerHTML=`
      <div>${p.text}</div>
      <small>${p.time}</small>
      <div onclick="like(${p.id})">▲ ${p.likes}</div>
      <div onclick="del(${p.id})">delete</div>
    `;

    feed.appendChild(div);
  });

  document.getElementById("rightName").innerText=currentUser;
  document.getElementById("rightFollowers").innerText=
    "Followers: "+(users[currentUser].followers.length||0);
}

function like(id){
  let posts=users[currentUser].posts;

  for(let p of posts){
    if(p.id===id){
      p.likedBy ||= [];

      if(p.likedBy.includes(currentUser)){
        p.likedBy=p.likedBy.filter(x=>x!==currentUser);
      } else {
        p.likedBy.push(currentUser);
      }

      p.likes=p.likedBy.length;
    }
  }

  save();
  render();
}

function del(id){
  users[currentUser].posts =
    users[currentUser].posts.filter(p=>p.id!==id);

  save();
  render();
}

function uploadPic(file){
  let r=new FileReader();
  r.onload=()=>{
    users[currentUser].pic=r.result;
    save();
    render();
  };
  r.readAsDataURL(file);
}

render();
