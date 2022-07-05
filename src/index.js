import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot,
         query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
  
const firebaseConfig = {
    apiKey: "AIzaSyAb6Gyqe7ogJWmCU7jodCmdCe1Xh1gk5Vg",
    authDomain: "fir-sandbox-85802.firebaseapp.com",
    projectId: "fir-sandbox-85802",
    storageBucket: "fir-sandbox-85802.appspot.com",
    messagingSenderId: "1090822842725",
    appId: "1:1090822842725:web:525d87c52acdd5e75b198c"
  };

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth();

// collection ref
const colRef = collection(db, 'nba_players')

const q = query(colRef, orderBy('createdAt'))


// realtime collection data
onSnapshot(q, (snapshot) => {
    let nba_players = []
    snapshot.docs.forEach(doc => {
       nba_players.push({ ...doc.data(), id: doc.id })
    })
    console.log(nba_players)
  })



// adding docs
const addPlayerForm = document.querySelector('.add')
addPlayerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    name: addPlayerForm.name.value,
    team: addPlayerForm.team.value,
    salary: addPlayerForm.salary.value,
    createdAt: serverTimestamp()

  })
  .then(() => {
    addPlayerForm.reset()
  })
})

// deleting docs
const deletePlayerForm = document.querySelector('.delete')
deletePlayerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'nba_players', deletePlayerForm.id.value)

  deleteDoc(docRef)
    .then(() => {
        deletePlayerForm.reset()
    })
})


// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})