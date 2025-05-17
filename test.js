(function () {
  "use strict";

  function buildNetflixFilterActivity() {
    const filters = {
      type: ["movie", "tv"],
      sort_by: [
        { title: "Популярні", value: "popularity.desc" },
        { title: "Найкращі", value: "vote_average.desc" },
        { title: "Нові", value: "release_date.desc" }
      ]
    };

    const filter = {
      type: "movie",
      sort_by: "popularity.desc"
    };

    const render = () => {
      const url = `discover/${filter.type}?with_watch_providers=8&watch_region=UA&sort_by=${filter.sort_by}`;

      Lampa.Activity.push({
        url: url,
        title: `Netflix – ${filter.type === 'movie' ? 'Фільми' : 'Серіали'}`,
        component: "category_full",
        source: "tmdb",
        card_type: "true",
        page: 1
      });
    };

    Lampa.Select.show({
      title: "Тип контенту",
      items: filters.type.map(t => ({ title: t === "movie" ? "Фільми" : "Серіали", value: t })),
      no_scroll: true,
      onSelect: (selectedType) => {
        filter.type = selectedType.value;
        Lampa.Select.show({
          title: "Сортування",
          items: filters.sort_by,
          no_scroll: true,
          onSelect: (selectedSort) => {
            filter.sort_by = selectedSort.value;
            render();
          }
        });
      }
    });
  }

  function init() {
    if (window.netflix_hub_ready) return;

    const item = $(`
      <li class="menu__item selector" data-action="netflix_hub">
        <div class="menu__ico">🎬</div>
        <div class="menu__text">Netflix</div>
      </li>
    `);

    item.on("hover:enter", function () {
      buildNetflixFilterActivity();
    });

    $(".menu .menu__list").eq(0).append(item);
    window.netflix_hub_ready = true;
  }

  if (window.appready) init();
  else Lampa.Listener.follow("app", function (e) {
    if (e.type === "ready") init();
  });
})();
