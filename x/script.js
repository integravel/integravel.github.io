import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "AIzaSyAHC2SbdaGCB8wVssDAc7kpFUvbG60q4K0",
  authDomain: "arrasta-o-x.firebaseapp.com",
  projectId: "arrasta-o-x",
  storageBucket: "arrasta-o-x.firebasestorage.app",
  messagingSenderId: "43422106005",
  appId: "1:43422106005:web:c9344f9a73db8106c3f69c",
  measurementId: "G-7ZK2WZ1R48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let alreadyCounted = false;

document.getElementById("login").addEventListener("click", async () => {
  const result = await signInWithPopup(auth, provider);
  currentUser = result.user;

  document.getElementById("user").textContent = currentUser.displayName;

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: currentUser.displayName,
      score: 0
    });
  }
});

/* ================= APP ================= */

const dropzones = document.querySelectorAll(".dropzone");
const returnZone = document.querySelector(".dropzone-return");

const blocksData = [
  { id: "1", tex: "\\( N \\text{ não é divisível por nenhum dos } p_i \\)" },
  { id: "2", tex: "\\( N \\text{ é primo ou composto} \\)" },
  { id: "3", tex: "\\( N \\text{ possui um divisor primo } q \\)" },
  { id: "4", tex: "\\( q \\notin \\{p_1,\\ldots,p_n\\} \\)" },
  { id: "5", tex: "\\( \\text{Existe um primo fora da lista} \\)" },
  { id: "6", tex: "\\( \\text{A hipótese de finitude é falsa} \\)" }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBlocks() {
  alreadyCounted = false;
  returnZone.innerHTML = "";

  const shuffled = [...blocksData];
  shuffle(shuffled);

  shuffled.forEach(data => {
    const div = document.createElement("div");
    div.className = "draggable";
    div.dataset.id = data.id;
    div.draggable = true;
    div.innerHTML = data.tex;

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", data.id);
    });

    returnZone.appendChild(div);
  });

  if (window.MathJax) MathJax.typesetPromise();
}

createBlocks();

function checkIndividual() {
  let allCorrect = true;

  dropzones.forEach(zone => {
    const esperado = zone.dataset.expected;
    const child = zone.firstElementChild;

    zone.classList.remove("correct", "wrong");

    if (!child) {
      allCorrect = false;
      return;
    }

    if (child.dataset.id === esperado) {
      zone.classList.add("correct");
    } else {
      zone.classList.add("wrong");
      allCorrect = false;
    }
  });

  if (allCorrect && !alreadyCounted) {
    alreadyCounted = true;
    saveProgress();
  }
}

async function saveProgress() {
  if (!currentUser) return;

  const ref = doc(db, "users", currentUser.uid);

  await setDoc(ref, {
    score: increment(1)
  }, { merge: true });
}

dropzones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", e => {
    e.preventDefault();

    if (zone.children.length > 0) return;

    const id = e.dataTransfer.getData("text/plain");
    const block = document.querySelector(`.draggable[data-id="${id}"]`);

    zone.appendChild(block);
    checkIndividual();

    if (window.MathJax) MathJax.typesetPromise();
  });
});

returnZone.addEventListener("dragover", e => e.preventDefault());

returnZone.addEventListener("drop", e => {
  e.preventDefault();

  const id = e.dataTransfer.getData("text/plain");
  const block = document.querySelector(`.draggable[data-id="${id}"]`);

  returnZone.appendChild(block);
  checkIndividual();

  if (window.MathJax) MathJax.typesetPromise();
});
