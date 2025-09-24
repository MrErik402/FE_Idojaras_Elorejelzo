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

/*----TÉMAVÁLTÁS----*/
let theme = "dark"

let lightmodeBTN = document.querySelector('#lightModeBTN');
let darkmodeBTN = document.querySelector('#darkModeBTN');


/*--Kattintás esemény--*/
lightmodeBTN.addEventListener('click', () => {
    setTheme('light');
    saveTheme('light');

});

darkmodeBTN.addEventListener('click', () => {
    setTheme('dark');
    saveTheme('dark');


});

/*--Betöltés--*/
function loadTheme() {
    if (localStorage.getItem('SCTheme')) {
        theme = localStorage.getItem('SCTheme');
        saveTheme(theme);

    }
    setTheme(theme);
}

/*--Mentés--*/
function saveTheme(theme) {
    localStorage.setItem('SCTheme', theme);
}

/*--Váltás--*/
function setTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
    setThemeBTN(theme);
    setCanvasJS() //Meghívjuk, hogy témaváltáskor frissüljön a chart

}

/*--Gombváltás--*/
function setThemeBTN(theme) {
    if (theme == 'light') {
        lightmodeBTN.classList.add('hide');
        darkmodeBTN.classList.remove('hide');
    }
    else {
        lightmodeBTN.classList.remove('hide');
        darkmodeBTN.classList.add('hide');

    }
}

/*--Dinamikus tartalom betöltés--*/
async function render(view) {
    main.innerHTML = await (await fetch(`./views/${view}.html`)).text()
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
async function getLoggedUser() {
    if (sessionStorage.getItem("loggedUser")) {
        loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
        mainNavbar.classList.add("hide")
        userNavbar.classList.remove("hide")
        await render("main")
    } else {
        loggedUser = null
        mainNavbar.classList.remove("hide")
        userNavbar.classList.add("hide")
        await render("login")
    }

}

getLoggedUser()
loadTheme()