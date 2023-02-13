/*
import Utenti from "./views/utenti/utenti.js";
import Bacheca from "./views/bacheca/bacheca.js";
import PostView from "./views/PostView.js";
import Prodotti from "./views/prodotti/prodotti.js";
import Servizi from "./views/servizi/servizi.js";
import ServiziOnline from "./views/serviziOnline/serviziOnline.js";
import frontoffice from "./views/utenti/utenti.js";
import game from "./views/utenti/utenti.js";
import logout from "./views/utenti/utenti.js";


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async() => {
    const routes = [
        { path: "/utenti", view: Utenti },
        { path: "/bacheca", view: Bacheca },
        { path: "/posts/:id", view: PostView },
        { path: "/prodotti", view: Prodotti },
        { path: "/servizi", view: Servizi },
        { path: "/serviziOnline", view: ServiziOnline },
        { path: "/utenti", view: frontoffice },
        { path: "/utenti", view: game },
        { path: "/utenti", view: logout }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});
*/