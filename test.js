(function () {
  "use strict";

  function openNetflixCategory(sort) {

    Lampa.Activity.push({url:"discover/tv?language=ua&with_networks=213",title:"Netflix",component:"category_full",source:"tmdb",sort:sort,card_type:"true",page:1});
  }

  function showNetflixFilter() {
    Lampa.Select.show({
      title: "Netflix – Вибери категорію",
      items: [
        { title: "Топ", value: "popularity" },
        { title: "Нові", value: "now" }
      ],
      no_scroll: true,
      onSelect: (selected) => openNetflixCategory(selected.value)
    });
  }

  function addMenuItem(title, id, onClick) {
    function tryAppend() {
      const menuList = $(".menu .menu__list").eq(0);
      if (menuList.length) {
        console.log(`📌 Додаю кнопку: ${title}`);
        const item = $(
          `<li class="menu__item selector" data-action="${id}">
            <div class="menu__ico">🎬</div>
            <div class="menu__text">${title}</div>
          </li>`
        );
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

    console.log("🎯 Netflix Hub плагін ініціалізовано");

    const enabled = Number(Lampa.Storage.get("netflix_enhanced_entry", 0)) === 1;

    if (enabled) addMenuItem("Netflix", "netflix_main", showNetflixFilter);

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
      onChange: function () {
        Lampa.Helper.show("Перезапусти Lampa для застосування змін.");
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
