function setCanvasJS() {
    //Megnézzük, hogy az oldalon van-e chartContainer, ha nincs akkor nem csinálunk semmit
    if (!document.getElementById("chartContainer")) {
        return;
    }
    let datas = []
    weather = weather.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    weather.forEach(day => {
        datas.push({
            label: day.date,
            y: [Number(day.min), Number(day.max)],
            name: day.type
        })
    });
    //Itt eldöntjük, hogy éppen sötétmód van-e vagy sem
    let selectedTheme = isDarkMode() ? "dark2" : "light2";
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: selectedTheme,
        title: {
            text: "Heti időjárás"
        },
        axisY: {
            suffix: " °C",
            maximum: 60,
            gridThickness: 0
        },
        toolTip: {
            shared: true,
            content: "{name} </br> <strong>Hőmérséklet: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
        },
        data: [{
            type: "rangeSplineArea",
            fillOpacity: 0.1,
            color: "#487FD9",
            indexLabelFormatter: formatter,
            dataPoints: datas
        }],
        animationEnabled: true,
        animationDuration: 2000
    });
    chart.render();
    var images = [];

    addImages(chart);

    function addImages(chart) {
        for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            var dpsName = chart.data[0].dataPoints[i].name;
            if (dpsName == "cloudy") {
                images.push($("<img>").attr("src", "../assest/img/weather/cloudy.png"));
            } else if (dpsName == "rainy") {
                images.push($("<img>").attr("src", "../assest/img/weather/rainy.png"));
            } else if (dpsName == "sunny") {
                images.push($("<img>").attr("src", "../assest/img/weather/sunny.png"));
            } else if (dpsName == "snow") {
                images.push($("<img>").attr("src", "../assest/img/weather/snow.png"));
            } else if (dpsName == "lighting") {
                images.push($("<img>").attr("src", "../assest/img/weather/lighting.png"));
            } else if (dpsName == "meteor") {
                images.push($("<img>").attr("src", "../assest/img/weather/meteor.png"));
            }

            images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
            positionImage(images[i], i);
        }
    }

    function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
        var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

        image.width("25px")
            .css({
                "left": imageCenter - 20 + "px",
                "position": "absolute", "top": imageTop + "px",
                "position": "absolute"
            });
    }

    $(window).resize(function () {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;
        var imageCenter = 0;
        for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if (chart.data[0].dataPoints[i].name == "cloudy") {
                $(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter });
            } else if (chart.data[0].dataPoints[i].name == "rainy") {
                $(".rainy").eq(rainyCounter++).css({ "left": imageCenter });
            } else if (chart.data[0].dataPoints[i].name == "sunny") {
                $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter });
            }
        }
    });

    function formatter(e) {
        if (e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°";
        } else if (e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°";
        } else {
            return e.dataPoint.y[e.index] + "°";
        }
    }

}

//Ezzel a függvénnyel ellenőrizzük le, hogy sötét mód van-e.
function isDarkMode() {
    const theme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    return theme === 'dark';
}