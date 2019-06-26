'use strict';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var request = require('request');

module.exports = function (Exploremusic) {
    let newAnimeArray = [];
    let popularAnimeArray = [];
    let featuredAnimeArray = [];

    function getExploreMusic() {
        var options = {
            url: 'https://myanimelist.net/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
            }
        };
        request(options, (err, res, body) => {
            const dom = new JSDOM(body);
            newAnimeArray = [];
            popularAnimeArray = [];
            featuredAnimeArray = [];
            for (let i = 0; i < 10; i++) {
                if (dom.window.document.getElementsByClassName("widget-slide")[0] && dom.window.document.getElementsByClassName("widget-slide")[0].childNodes[i] && dom.window.document.getElementsByClassName("widget-slide")[0].childNodes[i].childNodes[0] && dom.window.document.getElementsByClassName("widget-slide")[0].childNodes[i].childNodes[0].childNodes[0] && dom.window.document.getElementsByClassName("widget-slide")[0].childNodes[i].childNodes[0].childNodes[0].innerHTML && dom.window.document.getElementsByClassName("widget-slide")[0].getElementsByClassName("btn-anime")[i] && dom.window.document.getElementsByClassName("widget-slide")[0].getElementsByClassName("btn-anime")[i].getElementsByTagName("img")[0] && dom.window.document.getElementsByClassName("widget-slide")[0].getElementsByClassName("btn-anime")[i].getElementsByTagName("img")[0].getAttribute("data-src")) {
                    let generatedNewAnimeOBJ = {
                        title: dom.window.document.getElementsByClassName("widget-slide")[0].childNodes[i].childNodes[0].childNodes[0].innerHTML,
                        imgURL: dom.window.document.getElementsByClassName("widget-slide")[0].getElementsByClassName("btn-anime")[i].getElementsByTagName("img")[0].getAttribute("data-src")
                    };
                    newAnimeArray.push(generatedNewAnimeOBJ);
                }
                let x = i + 20;
                if (dom.window.document.getElementsByClassName("widget-slide")[2] && dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x] && dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByClassName("external-link")[0] && dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByClassName("external-link")[0].textContent && dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByTagName("img")[0] && dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByTagName("img")[0].getAttribute("data-src")) {
                    let generatedPopularAnimeOBJ = {
                        title: dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByClassName("external-link")[0].textContent,
                        imgURL: dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[x].getElementsByTagName("img")[0].getAttribute("data-src")
                    };
                    popularAnimeArray.push(generatedPopularAnimeOBJ);
                }
            }
            for (let i = 0; i < 20; i++) {
                let generatedFeaturedAnimeOBJ = {
                    title: dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[i].getElementsByClassName("external-link")[0].textContent,
                    imgURL: dom.window.document.getElementsByClassName("widget-slide")[2].getElementsByClassName("btn-anime")[i].getElementsByTagName("img")[0].getAttribute("data-src")
                }
                featuredAnimeArray.push(generatedFeaturedAnimeOBJ);
            }
        });
    }

    getExploreMusic();

    setInterval(() => {
        getExploreMusic();
    }, 3600000)

    Exploremusic.beforeRemote("create", (ctx, model, next) => {
        if (ctx.args.data.action == "getAlbum") {
            getSongs(ctx.args.data.name);
        } else if (ctx.args.data.action == "getLink") {
            getYoutubeLink(ctx.args.data.name, ctx.args.data.animeName);
        } else if (ctx.args.data.action == "getExplore") {
            ctx.args.data.newAnime = newAnimeArray;
            ctx.args.data.featuredAnime = featuredAnimeArray;
            ctx.args.data.popularAnime = popularAnimeArray;
            next();
        } else if (ctx.args.data.action == "loadMoreSongs") {
            loadMoreSongs(ctx.args.data.name);
        }
        Exploremusic.destroyAll((err, info) => {
            console.log("Request processed.");
        })

        function getYoutubeLink(specificSong, animeName) {
            console.log('https://www.youtube.com/results?search_query=' + specificSong + " " + animeName);
            var options = {
                url: 'https://www.youtube.com/results?search_query=' + specificSong + " " + animeName,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
                }
            };
            let youtubeLink;
            let videoTime;
            request(options, (err, res, body) => {
                const dom = new JSDOM(body);
                if (dom.window.document.getElementsByClassName("yt-badge-ad")[0]) {
                    youtubeLink = dom.window.document.getElementsByClassName('yt-lockup-title')[1].getElementsByTagName('a')[0].href;
                    videoTime = dom.window.document.getElementsByClassName('yt-lockup-title')[1].getElementsByClassName("accessible-description")[0].innerHTML;
                } else if (dom.window.document.getElementsByClassName('yt-lockup-title')[0]) {
                    youtubeLink = dom.window.document.getElementsByClassName('yt-lockup-title')[0].getElementsByTagName('a')[0].href;
                    videoTime = dom.window.document.getElementsByClassName('yt-lockup-title')[0].getElementsByClassName("accessible-description")[0].innerHTML;
                }
                youtubeLink = youtubeLink.substring(9);
                ctx.args.data.youtubeLink = youtubeLink;
                ctx.args.data.videoTime = videoTime;
                next();
            });
        }

        function getSongs(specificAnime) {
            var options = {
                url: 'https://www.google.com/search?q=myanimelist ' + specificAnime,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
                }
            };
            console.log(options.url);
            let myAnimeListLink;
            let arrayOfAnimeSongs = [];
            request(options, (err, res, body) => {
                const dom = new JSDOM(body);
                myAnimeListLink = dom.window.document.getElementById("search").getElementsByClassName("r")[0].getElementsByTagName("a")[0].href;
                var options1 = {
                    url: myAnimeListLink,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
                    }
                };
                console.log(options1.url);
                request(options1, (err, res, body) => {
                    const dom = new JSDOM(body);
                    let image = dom.window.document.getElementsByClassName("ac")[0].src;
                    let title = dom.window.document.getElementsByClassName("h1")[0].textContent;
                    for (let i = 0; i < dom.window.document.getElementsByClassName("theme-song").length; i++) {
                        arrayOfAnimeSongs.push(dom.window.document.getElementsByClassName("theme-song")[i].textContent);
                    }
                    ctx.args.data.album = arrayOfAnimeSongs;
                    ctx.args.data.imgURL = image;
                    ctx.args.data.title = title;
                    next();
                });
            });
        }

        function loadMoreSongs(pageToLoad) {
            var options = {
                url: 'https://myanimelist.net/topanime.php' + pageToLoad,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
                }
            };
            console.log(options.url);

            let loadedAnimeArray = [];
            request(options, (err, res, body) => {
                const dom = new JSDOM(body);
                loadedAnimeArray = [];
                for (let i = 0; i < 30; i++) {
                    let generatedLoadedAnimeOBJ = {
                        title: dom.window.document.getElementsByClassName("tile-unit")[i].getElementsByClassName("title")[0].textContent,
                        imgURL: dom.window.document.getElementsByClassName("tile-unit")[i].getAttribute("data-bg")
                    }
                    loadedAnimeArray.push(generatedLoadedAnimeOBJ);
                }
                ctx.args.data.loadedAnime = loadedAnimeArray;
                next();
            });
        }
    })
};
