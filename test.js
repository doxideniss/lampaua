(function () {
  "use strict";

  function createNetflixItem(title, url, id) {
    const item = $(`
      <li class="menu__item selector" data-action="${id}">
        <div class="menu__ico">📺</div>
        <div class="menu__text">${title}</div>
      </li>
    `);

    item.on("hover:enter", function () {
      Lampa.Activity.push({
        url: url,
        title: title,
        component: "category_full",
        source: "tmdb",
        card_type: "true",
        page: 1
      });
    });

    return item;
  }

  function buildNetflixHubMenu() {
    const menuItems = [
      {
        title: "Netflix - Топ фільми",
        url: "discover/movie?with_watch_providers=8&watch_region=UA&sort_by=vote_average.desc",
        id: "netflix_top_movies"
      },
      {
        title: "Netflix - Топ серіали",
        url: "discover/tv?with_watch_providers=8&watch_region=UA&sort_by=vote_average.desc",
        id: "netflix_top_tv"
      },
      {
        title: "Netflix - Нові фільми",
        url: "discover/movie?with_watch_providers=8&watch_region=UA&sort_by=release_date.desc",
        id: "netflix_new_movies"
      },
      {
        title: "Netflix - Нові серіали",
        url: "discover/tv?with_watch_providers=8&watch_region=UA&sort_by=first_air_date.desc",
        id: "netflix_new_tv"
      }
    ];

    menuItems.forEach(({ title, url, id }) => {
      const item = createNetflixItem(title, url, id);
      $(".menu .menu__list").eq(0).append(item);
    });
  }

  function init() {
    if (window.netflix_hub_ready) return;
    buildNetflixHubMenu();
    window.netflix_hub_ready = true;
  }

  if (window.appready) init();
  else Lampa.Listener.follow("app", function (e) {
    if (e.type === "ready") init();
  });
})();
