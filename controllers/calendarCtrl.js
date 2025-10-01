let eventsList = []

async function getCalendarData() {
    chartLabels = []
    chartData = []
    try {
        eventsList = []
        let res = await fetch(`${ServerURL}/weather/${loggedUser.id}`);
        weather = await res.json();

        weather.forEach(day => {
            eventsList.push(
                { title: `Típus: ${day.type}`, start: day.date, backgroundColor: "green", borderColor: "green" },
                { title: `Min: ${day.min} °C`, start: day.date, backgroundColor: "white", textColor: "black", borderColor:"white" },
                { title: `Max: ${day.max} °C`, start: day.date, backgroundColor: "red", borderColor: "red" },

            )
        });
    } catch (err) {
        console.log(err)
        showAlert("Hiba!", "Hiba az adatok lekérdezésében!", "danger")
    }
}
function initCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: eventsList
    });
    calendar.render();
}