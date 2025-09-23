//Adatok
const COMPANY = "Bajai SZC Türr István Technikum"
const AUTHOR = "Bujáki Erik Attila 13.A"
const APPTITLE = "Időjárás előrejelző applikáció"
const ServerURL = "http://localhost:3000"

let loggedUser = null;

//Beírások
document.querySelector('#title').innerHTML = APPTITLE;
document.querySelector('#company').innerHTML = COMPANY;
document.querySelector('#author').innerHTML = AUTHOR;

//Globális dokumentum elemek 
let main = document.querySelector('main') 
let mainNavbar = document.querySelector('#mainMenu')
let userNavbar = document.querySelector('#userMenu')

//Témaváltás
let theme = "dark"

let darkBTN = document.querySelector('#darkModeBTN');
let lightBTN = document.querySelector('#lightModeBTN');

darkBTN.addEventListener('click', ()=>{
    setTheme('dark')
    saveTheme('dark')
})
lightBTN.addEventListener('click', ()=>{
    setTheme('light')
    saveTheme('light')
})

//Téma beállítása
function setTheme(theme){
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    }else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
    setThemeButton(theme);
}

//Téma mentése
function saveTheme(theme){
    localStorage.setItem('OldalTema', theme)
}

//Téma betöltése
function loadTheme(){
    if(localStorage.getItem('OldalTema')){
        theme = localStorage.getItem('OldalTema');
        saveTheme(theme);
        
    }
    setTheme(theme);
}

//Témaváltó gombok váltakozása
function setThemeButton(){
    if(theme=='light'){
        darkBTN.classList.remove("hide")
        lightBTN.classList.add("hide")
    }else{
        darkBTN.classList.add("hide")
        lightBTN.classList.remove("hide")
    }
}

async function render(view){
    main.innerHTML = await(await fetch(`./views/${view}.html`)).text()
    switch (view) {
        case "profile":
            getProfile()
            break;
        case "main":
            setDateMin()
            getWeatherDatas()
            setButton()
            break;
        case "statistics":
            setCanvasJS()
            break;
        case "calendar":
            await getCalendarData()
            initCalendar();
            break;
        default:
            break;
    }
}

//Betölteni a sessionStorageből a loggedUser
async function getLoggedUser(){
    if(sessionStorage.getItem("loggedUser")){
        loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
        mainNavbar.classList.add("hide")
        userNavbar.classList.remove("hide")
        await render("main")
    }else{
        loggedUser = null
        mainNavbar.classList.remove("hide")
        userNavbar.classList.add("hide")
        await render("login")
    }
    
}

getLoggedUser()
loadTheme()