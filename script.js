// Firebase Config
const firebaseConfig = {
  apiKey: "ضع هنا API Key",
  authDomain: "ضع هنا authDomain",
  projectId: "ضع هنا projectId",
  storageBucket: "ضع هنا storageBucket",
  messagingSenderId: "ضع هنا messagingSenderId",
  appId: "ضع هنا appId"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// الوضع الليلي / النهاري
function toggleMode(){
  document.body.classList.toggle('bg-dark');
}

// كتابة ترحيبية متغيرة
const texts = ["مرحبًا بك في Yasser Gaming!", "أهلاً باللاعبين!", "جاهز للفوز؟"];
let i=0, j=0;
function typeText(){
  const elem = document.getElementById("typing");
  if(!elem) return;
  if(i<texts[j].length){
    elem.textContent += texts[j][i++];
    setTimeout(typeText,100);
  } else {
    setTimeout(()=>{
      elem.textContent="";
      i=0;
      j=(j+1)%texts.length;
      typeText();
    },1000);
  }
}
typeText();

// تسجيل دخول
function loginEmail(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(()=> window.location="index.html")
    .catch(e=>alert(e.message));
}

function loginGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(()=> window.location="index.html")
    .catch(e=>alert(e.message));
}

// الترحيب باسم المستخدم
auth.onAuthStateChanged(user=>{
  const welcome = document.getElementById("welcome");
  if(user && welcome){
    welcome.textContent = `أهلاً ${user.displayName || user.email}! 👋`;
  }
});

// التعليقات
function addComment(){
  const text = document.getElementById("comment-text").value;
  if(!text) return;
  db.collection("comments").add({text, timestamp: Date.now()})
    .then(()=>{ document.getElementById("comment-text").value=""; loadComments(); });
}

function loadComments(){
  const list = document.getElementById("comment-list");
  if(!list) return;
  list.innerHTML="";
  db.collection("comments").orderBy("timestamp","desc").get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        const div = document.createElement("div");
        div.className="comment";
        div.textContent = doc.data().text;
        list.appendChild(div);
      });
    });
}
loadComments();

// عرض فيديوهات تلقائي
const latestVideos = document.getElementById("latest-videos");
if(latestVideos){
  const videos = ["6wk5ZW6d8_U","SYSjZZLNhc0"];
  videos.forEach(id=>{
    const div = document.createElement("div");
    div.className="card";
    div.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
    latestVideos.appendChild(div);
  });
}
