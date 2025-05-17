(function () {
  "use strict";

  function openNetflixActivity(type, sort) {
    let url = "";
    let title = "Netflix";

    if (type === "movie") {
      url = `discover/movie?language=ua&with_watch_providers=8&watch_region=UA`;
      title = "Netflix – Фільми";
    } else {
      url = `discover/tv?language=ua&with_networks=213`;
      title = "Netflix – Серіали";
    }

    const isNew = sort === "first_air_date.desc" || sort === "primary_release_date.desc";

    if (isNew) {
      url += "&vote_count.gte=300";
      title += " – Нові";
    } else {
      title += " – Топ";
    }

    if (sort) url += `&sort_by=${sort}`;

    Lampa.Activity.push({
      url: url,
      title: title,
      component: "category_full",
      source: "tmdb",
      card_type: "true",
      page: 1
    });
  }

  function showNetflixSortFilter(type) {
    const sortItems = [
      { title: "Топ", value: "" },
      { title: "Нові", value: type === "movie" ? "primary_release_date.desc" : "first_air_date.desc" }
    ];

    Lampa.Select.show({
      title: "Netflix – Сортування",
      items: sortItems,
      no_scroll: true,
      onSelect: (selected) => openNetflixActivity(type, selected.value)
    });
  }

  function showNetflixTypeFilter() {
    Lampa.Select.show({
      title: "Netflix – Вибери тип",
      items: [
        { title: "Серіали", value: "tv" },
        { title: "Фільми", value: "movie" }
      ],
      no_scroll: true,
      onSelect: (selected) => showNetflixSortFilter(selected.value)
    });
  }

  function addMenuItem(title, id, onClick) {
    function tryAppend() {
      const menuList = $(".menu .menu__list").eq(0);
      if (menuList.length) {
        const item = $(`
          <li class="menu__item selector" data-action="${id}">
            <div class="menu__ico">🎬</div>
            <div class="menu__text">${title}</div>
          </li>
        `);
        item.on("hover:enter", onClick);
        menuList.append(item);
      } else {
        setTimeout(tryAppend, 300);
      }
    }
    tryAppend();
  }

  function init() {
    if (window.netflix_enhanced_ready) return;

    const enabled = Number(Lampa.Storage.get("netflix_enhanced_entry", 0)) === 1;

    if (enabled) addMenuItem("Netflix", "netflix_main", showNetflixTypeFilter);

    // Settings
    Lampa.SettingsApi.addComponent({
      component: "netflix_enhanced",
      name: "Netflix Enhanced",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M84 0v512h88V308l88 204h88V0h-88v204l-88-204z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
      component: "netflix_enhanced",
      param: {
        name: "netflix_enhanced_entry",
        type: "select",
        values: {
          1: "Показувати",
          0: "Приховати"
        },
        default: 0
      },
      field: {
        name: "Кнопка Netflix"
      },
      onChange: function (value) {
        const existing = $("[data-action='netflix_main']");
        if (value === "1") {
          if (!existing.length) addMenuItem("Netflix", "netflix_main", showNetflixTypeFilter);
        } else {
          existing.remove();
        }
      }
    });

    window.netflix_enhanced_ready = true;
  }

  if (window.appready) init();
  else {
    Lampa.Listener.follow("app", function (e) {
      if (e.type === "ready") init();
    });

    setTimeout(() => {
      if (!window.netflix_enhanced_ready) init();
    }, 1000);
  }
})();
