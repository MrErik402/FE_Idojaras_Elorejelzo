//Adatok feltöltése, Módosítása, Törlése, Táblázatba megjelenítés

let weather = [];
let selectedWeather = null
function setButton() {
    const weatherBTN = document.querySelector('#weatherBTN')
    const weatherEditBTN = document.querySelector('#weatherEditBTN')
}

function setDateMin() {
    let today = new Date().toISOString().split('T')[0];
    const dateField = document.querySelector("#dateField");
    dateField.setAttribute('min', today)
}

async function getWeatherDatas() {
    try {
        let res = await fetch(`${ServerURL}/weather/${loggedUser.id}`);
        weather = await res.json();
        weather = weather.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        weatherRender()
    } catch (err) {
        console.log(err)
        showAlert("Hiba", "Hiba az időjárásadataid lekérése alatt!", "danger")
    }
}

async function weatherAdd() {
    const dateField = document.querySelector('#dateField').value; //STRING
    const minField = document.querySelector('#minField').value; //NUMBER
    const maxField = document.querySelector('#maxField').value; //NUMBER
    const weatherType = document.querySelector('#weatherType').value; //STRING
    const honap = dateField.split('-')[1];
    if (minField > maxField) {
        showAlert("Figyelmeztetés!", "A minimum érték nem lehet nagyobb mint a maximum érték!", "warning");
        return;
    }
    if (dateField == "" || minField == "" || maxField == "" || weatherType == "") {
        showAlert("Figyelmeztetés!", "Minden adatot meg kell adnod!", "warning");
        return;
    }
    if ((honap == 12 || honap == 1 || honap == 2) && maxField > 20) { //Ekkor tél van
        showAlert("Figyelmeztetés!", "A megadott maximális hőmérséklet nem felel meg a téli hónapnak megadott követelményeknek!", "info")
        return;
    }
    if ((honap == 6 || honap == 7 || honap == 8) && minField < 0) { //Ekkor nyár van
        showAlert("Figyelmeztetés!", "Nyáron nem lehet negatív a hőmérséklet!", "info")
        return;
    }
    if ((honap == 3 || honap == 4 || honap == 5) && minField < -5) { //Ekkor tavasz van
        showAlert("Figyelmeztetés!", "Tavasszal nem lehet -5°C-nál kevesebb a hőmérséklet!", "info")
        return;
    }
    if ((honap == 3 || honap == 4 || honap == 5) && maxField > 30) { //Ekkor tavasz van
        showAlert("Figyelmeztetés!", "Tavasszal nem lehet 30°C-nál több a hőmérséklet!", "info")
        return;
    }
    if ((honap == 9 || honap == 10 || honap == 11) && maxField > 35) { //Ekkor ősz van
        showAlert("Figyelmeztetés!", "Ősszel nem lehet 35°C-nál több a hőmérséklet!", "info")
        return;
    }
    if ((honap == 9 || honap == 10 || honap == 11) && minField < -5) { //Ekkor ősz van
        showAlert("Figyelmeztetés!", "Ősszel nem lehet -5°C-nál kevesebb a hőmérséklet!", "info")
        return;
    }
    if (!(honap == 12 || honap == 1 || honap == 2 || honap == 11 || honap == 3) && weatherType == "snow") { //Ekkor havazhat (hónapokban)
        alert(honap)
        showAlert("Figyelmeztetés!", "Az általad megadott hónapban nem havazhat!", "info")
        return;
    }
    if (weatherType == "snow" && maxField > 7) { //Ekkor havazik
        showAlert("Figyelmeztetés!", "Havazáskor nem lehet 7°C-nál nagyobb a hőmérséklet", "info")
        return;
    }
    try {
        const res = await fetch(`${ServerURL}/weather`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: loggedUser.id,
                date: dateField,
                min: minField,
                max: maxField,
                type: weatherType
            })
        })
        const data = await res.json();
        document.querySelector('#dateField').value == "";
        document.querySelector('#minField').value == "";
        document.querySelector('#maxField').value == "";
        document.querySelector('#weatherType').value == "";
        showAlert(data.title, data.message, data.type)
        getWeatherDatas()
    } catch (err) {
        showAlert("Hiba", "Hiba történt az adatok feltöltése folyamat során!", "danger")
        return;
    }
}

async function weatherRender() {
    /*Le kell kérni az összes időjárását a felhasználónak*/
    const tableBody = document.querySelector('#tableBody');
    tableBody.innerHTML = ""
    weather.forEach((day, index) => {
        /*---ELEM LÉTREHOZÁSOK---*/
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let img = document.createElement('img');
        let editBTN = document.createElement('button');
        let delBTN = document.createElement('button');
        /*---ÉRTÉKADÁS---*/
        td1.innerHTML = index + 1 + ".";
        td2.innerHTML = day.date;
        td3.innerHTML = day.min;
        td4.innerHTML = day.max;
        img.setAttribute("src", `../assest/img/weather/${day.type}.png`)
        editBTN.innerHTML = '<i class="bi bi-pencil-fill"></i>'
        delBTN.innerHTML = '<i class="bi bi-trash-fill"></i>'
        /*---OSZTÁLYOK---*/
        td1.classList.add("text-end")
        td2.classList.add("text-end")
        td3.classList.add("text-end")
        td4.classList.add("text-end")
        editBTN.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2')
        delBTN.classList.add('btn', 'btn-danger', 'btn-sm')
        img.classList.add("miniImage")
        /*---Append childolás---*/
        td6.appendChild(editBTN)
        td6.appendChild(delBTN)
        td5.appendChild(img)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)
        tableBody.appendChild(tr)
        /*---EGYÉB ATRIBÚTUMOK---*/
        editBTN.setAttribute('onclick', `editWeather(${index})`)
        delBTN.setAttribute('onclick', `deleteWeather(${day.id})`)

    })
}

async function deleteWeather(index) {
    try {
        const res = await fetch(`${ServerURL}/weather/${index}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        showAlert(data.title, data.message, data.type)
        getWeatherDatas()
    } catch (err) {
        showAlert("Hiba", "Hiba történt az adatok törlése folyamat során!", "danger")
        return;
    }
}

function editWeather(index) {
    selectedWeather = weather[index]
    weatherBTN.classList.add('hide')
    weatherEditBTN.classList.remove('hide')
    document.querySelector('#dateField').value = selectedWeather.date;
    document.querySelector('#minField').value = selectedWeather.min;
    document.querySelector('#maxField').value = selectedWeather.max;
    document.querySelector('#weatherType').value = selectedWeather.type;
}

async function weatherSave() {
    deleteWeather(selectedWeather.id)
    selectedWeather = null
    const dateField = document.querySelector('#dateField').value; //STRING
    const minField = document.querySelector('#minField').value; //NUMBER
    const maxField = document.querySelector('#maxField').value; //NUMBER
    const weatherType = document.querySelector('#weatherType').value; //STRING
    const honap = dateField.split('-')[1];
    if (minField > maxField) {
        showAlert("Figyelmeztetés!", "A minimum érték nem lehet nagyobb mint a maximum érték!", "warning");
        return;
    }
    if (dateField == "" || minField == "" || maxField == "" || weatherType == "") {
        showAlert("Figyelmeztetés!", "Minden adatot meg kell adnod!", "warning");
        return;
    }
    if ((honap == 12 || honap == 1 || honap == 2) && maxField > 20) { //Ekkor tél van
        showAlert("Figyelmeztetés!", "A megadott maximális hőmérséklet nem felel meg a téli hónapnak megadott követelményeknek!", "info")
        return;
    }
    if ((honap == 6 || honap == 7 || honap == 8) && minField < 0) { //Ekkor nyár van
        showAlert("Figyelmeztetés!", "Nyáron nem lehet negatív a hőmérséklet!", "info")
        return;
    }
    if ((honap == 3 || honap == 4 || honap == 5) && minField < -5) { //Ekkor tavasz van
        showAlert("Figyelmeztetés!", "Tavasszal nem lehet -5°C-nál kevesebb a hőmérséklet!", "info")
        return;
    }
    if ((honap == 3 || honap == 4 || honap == 5) && maxField > 30) { //Ekkor tavasz van
        showAlert("Figyelmeztetés!", "Tavasszal nem lehet 30°C-nál több a hőmérséklet!", "info")
        return;
    }
    if ((honap == 9 || honap == 10 || honap == 11) && maxField > 35) { //Ekkor ősz van
        showAlert("Figyelmeztetés!", "Ősszel nem lehet 35°C-nál több a hőmérséklet!", "info")
        return;
    }
    if ((honap == 9 || honap == 10 || honap == 11) && minField < -5) { //Ekkor ősz van
        showAlert("Figyelmeztetés!", "Ősszel nem lehet -5°C-nál kevesebb a hőmérséklet!", "info")
        return;
    }
    if ((honap != 12 || honap != 1 || honap != 2 || honap != 11 || honap != 3) && weatherType == "snow") { //Ekkor havazhat (hónapokban)
        showAlert("Figyelmeztetés!", "Az általad megadott hónapban nem havazhat!", "info")
        return;
    }
    if (weatherType == "snow" && maxField > 7) { //Ekkor havazik
        showAlert("Figyelmeztetés!", "Havazáskor nem lehet 7°C-nál nagyobb a hőmérséklet", "info")
        return;
    }
    try {
        const res = await fetch(`${ServerURL}/weather`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: loggedUser.id,
                date: dateField,
                min: minField,
                max: maxField,
                type: weatherType
            })
        })
        const data = await res.json();
        if (res.status == 200) {
            document.querySelector('#dateField').value == "";
            document.querySelector('#minField').value == "";
            document.querySelector('#maxField').value == "";
            document.querySelector('#weatherType').value == "";
        }
        showAlert(data.title, data.message, data.type)
        getWeatherDatas()
    } catch (err) {
        showAlert("Hiba", "Hiba történt az adatok feltöltése folyamat során!", "danger")
        return;
    }
}