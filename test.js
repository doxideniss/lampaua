(function () {
  "use strict";

  function openNetflixActivity(type) {
    let url = "";
    if (type === "movie") {
      url = "discover/movie?with_networks=213";
    } else {
      url = "discover/tv?first_air_date.lte=2025-12-31&first_air_date.gte=2020-01-01&with_networks=213";
    }

    Lampa.Activity.push({
      url: url,
      title: `Netflix – ${type === 'movie' ? 'Фільми' : 'Серіали'}`,
      component: "category_full",
      source: "tmdb",
      card_type: "true",
      page: 1
    });
  }

  function addMenuItem(title, id, onClick) {
    const item = $(
      `<li class="menu__item selector" data-action="${id}">
        <div class="menu__ico">🎬</div>
        <div class="menu__text">${title}</div>
      </li>`
    );
    item.on("hover:enter", onClick);
    $(".menu .menu__list").eq(0).append(item);
  }

  function init() {
    if (window.netflix_enhanced_ready) return;

    const enableFilms = Lampa.Storage.get("netflix_enhanced_films", "1") === "1";
    const enableSeries = Lampa.Storage.get("netflix_enhanced_series", "1") === "1";

    if (enableFilms) addMenuItem("Netflix Фільми", "netflix_movies", () => openNetflixActivity("movie"));
    if (enableSeries) addMenuItem("Netflix Серіали", "netflix_series", () => openNetflixActivity("tv"));

    // Settings
    Lampa.SettingsApi.addComponent({
      component: "netflix_enhanced",
      name: "Netflix Enhanced",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M84 0v512h88V308l88 204h88V0h-88v204l-88-204z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
      component: "netflix_enhanced",
      param: {
        name: "netflix_enhanced_films",
        type: "select",
        values: {
          1: "Показувати",
          0: "Приховати"
        },
        default: 1
      },
      field: {
        name: "Netflix Фільми"
      },
      onChange: function () {
        Lampa.Helper.show("Перезапусти Lampa для застосування змін.");
      }
    });

    Lampa.SettingsApi.addParam({
      component: "netflix_enhanced",
      param: {
        name: "netflix_enhanced_series",
        type: "select",
        values: {
          1: "Показувати",
          0: "Приховати"
        },
        default: 1
      },
      field: {
        name: "Netflix Серіали"
      },
      onChange: function () {
        Lampa.Helper.show("Перезапусти Lampa для застосування змін.");
      }
    });

    window.netflix_enhanced_ready = true;
  }

  if (window.appready) init();
  else Lampa.Listener.follow("app", function (e) {
    if (e.type === "ready") init();
  });
})();
