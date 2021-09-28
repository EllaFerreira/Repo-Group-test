$(document).ready(function () {
  var r = "4db0ecc50931d8bc3a1068d8ea20e285",
    n = [];
  function e(t) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        t +
        "&units=imperial&APPID=" +
        r,
      method: "GET",
    }).then(function (t) {
      i(t.coord.lat, t.coord.lon),
        $("#currentIcon").attr(
          "src",
          "https://openweathermap.org/img/wn/" + t.weather[0].icon + "@2x.png"
        ),
        $("#currentCity").text(t.name),
        $("#currentDate").text(moment().format("MMMM Do, YYYY")),
        $("#currentTemperature").text(
          "Current Temperature: " + t.main.temp.toFixed() + "°"
        ),
        $("#currentHumidity").text("Humidity: " + t.main.humidity + "%"),
        $("#currentWindSpeed").text("Wind Speed: " + t.wind.speed + " mph");
    });
  }
  function a(t) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        t +
        "&units=imperial&APPID=" +
        r,
      method: "GET",
    }).then(function (t) {
      for (var e = [], r = 0; r < t.list.length; r++)
        "18:00:00" === t.list[r].dt_txt.split(" ")[1] && e.push(t.list[r]);
      for (var n = 0; n < e.length; n++) {
        $("#day" + (n + 1)).empty();
        var a = $("<div>");
        a.text(moment(e[n].dt_txt).format("dddd")),
          a.attr("style", "font-weight:600");
        var i = $("<div>");
        i.text(moment(e[n].dt_txt).format("MM/DD/YYYY"));
        var o = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/wn/" +
              e[n].weather[0].icon +
              "@2x.png"
          ),
          c = $("<div>");
        c.text(e[n].main.temp.toFixed() + "°");
        var d = $("<div>");
        d.text(e[n].main.humidity + "% Humidity"),
          $("#day" + (n + 1)).append(a, i, o, c, d);
      }
    });
  }
  function i(t, e) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&lat=" +
        t +
        "&lon=" +
        e +
        "&cnt=1&APPID=" +
        r,
      method: "GET",
    }).then(function (t) {
      $("#currentUVIndex").text("UV Index: " + t[0].value);
    });
  }
  localStorage.getItem("cityHistory") &&
    (function (t) {
      for (var e = 0; e < t.length; e++) {
        var r = $("<a>");
        r.attr("class", "panel-block"),
          r.text(t[e]),
          r.attr("id", t[e]),
          $("#cityHistoryContainer").prepend(r);
      }
    })((n = JSON.parse(localStorage.getItem("cityHistory")))),
    "geolocation" in navigator
      ? navigator.geolocation.getCurrentPosition(
          function (t) {
            var e;
            $("progress").attr("style", "display:none"),
              $("#main").removeAttr("style"),
              (e = t.coords.latitude),
              (t = t.coords.longitude),
              $.ajax({
                url:
                  "https://api.openweathermap.org/data/2.5/weather?lat=" +
                  e +
                  "&lon=" +
                  t +
                  "&units=imperial&APPID=" +
                  r,
                method: "GET",
              }).then(function (t) {
                a(t.name),
                  i(t.coord.lat, t.coord.lon),
                  $("#headerCity").text("Current location: " + t.name),
                  $("#currentIcon").attr(
                    "src",
                    "https://openweathermap.org/img/wn/" +
                      t.weather[0].icon +
                      "@2x.png"
                  ),
                  $("#currentCity").text(t.name),
                  $("#currentDate").text(moment().format("MMMM Do, YYYY")),
                  $("#currentTemperature").text(
                    "Current Temperature: " + t.main.temp.toFixed() + "°"
                  ),
                  $("#currentHumidity").text(
                    "Humidity: " + t.main.humidity + "%"
                  ),
                  $("#currentWindSpeed").text(
                    "Wind Speed: " + t.wind.speed + " mph"
                  );
              });
          },
          function (t) {
            t.code === t.PERMISSION_DENIED &&
              ($("#progressBar").attr("style", "display:none"),
              $("#main").removeAttr("style"),
              n[0]
                ? (e(n[n.length - 1]), a(n[n.length - 1]))
                : (e("San Francisco"), a("San Francisco")));
          }
        )
      : ($("#progressBar").attr("style", "display:none"),
        $("#main").removeAttr("style"),
        n[0]
          ? (e(n[n.length - 1]), a(n[n.length - 1]))
          : (e("San Francisco"), a("San Francisco"))),
    $("#citySearch").on("keydown", function (t) {
      13 == t.keyCode &&
        (t.preventDefault(),
        (t = $(this).val()),
        $(this).val(""),
        (function (t) {
          n.push(t), localStorage.setItem("cityHistory", JSON.stringify(n));
          var e = $("<a>");
          e.attr("class", "panel-block"),
            e.text(t),
            e.attr("id", t),
            $("#cityHistoryContainer").prepend(e);
        })(t),
        e(t),
        a(t));
    }),
    $("#cityHistoryContainer").on("click", function (t) {
      t.target.matches("a") && (t.preventDefault(), e((t = t.target.id)), a(t));
    }),
    $("#clear").on("click", function (t) {
      $("#cityHistoryContainer").text(""), localStorage.clear();
    });
});
