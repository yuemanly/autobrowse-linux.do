// ==UserScript==
// @name        autoBrowse-linux.do
// @description Automatically browse posts in linux.do
// @namespace   Violentmonkey Scripts
// @match       https://linux.do/*
// @match       https://linux.do/latest?ascending=false&order=posts
// @grant       none
// @version     1.0
// @author      yuemanly
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=linux.do
// ==/UserScript==

var speed = 10;
var scrollDistance = 3;
var scrollDuration = 1000;
var pauseDuration = 800;

var scrollInterval;
var pauseTimeout;
var isScrolling = false;

function navigateNextTopic() {
    const URLS = ["https://linux.do/new", "https://linux.do/top", "https://linux.do/latest?ascending=false&order=posts"];
    const randomIndex = Math.floor(Math.random() * URLS.length);
    const newURL = URLS[randomIndex];
    console.log("Navigating to new URL: " + newURL);
    window.location.href = newURL;
}

function startScrolling() {
    if (isScrolling) return;
    isScrolling = true;
    button.textContent = "停止";
    button.disabled = false;
    scrollInterval = setInterval(function() {
        window.scrollBy(0, scrollDistance);
        var scrollHeight = document.documentElement.scrollHeight;
        var totalScroll = window.innerHeight + window.scrollY;
        console.log("Scroll Height: " + scrollHeight);
        console.log("Total Scroll: " + totalScroll);
        if ((totalScroll + 1) >= scrollHeight) {
            console.log("Reached bottom. Navigating to newURL...");
            clearInterval(scrollInterval);
            navigateNextTopic();
        }
    }, speed);

    pauseTimeout = setTimeout(function() {
        clearInterval(scrollInterval);
        isScrolling = false;
        setTimeout(startScrolling, pauseDuration);
    }, scrollDuration);
}

function stopScrolling() {
    clearInterval(scrollInterval);
    clearTimeout(pauseTimeout);
    isScrolling = false;
    button.textContent = "开始";
    button.disabled = false;
}

function findLinkAndRedirect() {
    const topicPattern = "/t/topic"
    var links = document.links;
    var matchingLinks = [];

    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf(topicPattern) !== -1) {
            matchingLinks.push(links[i].href);
        }
        if (matchingLinks.length == 5) {
            break;
        }
    }

    if (matchingLinks.length > 0) {
        var randomIndex = Math.floor(Math.random() * matchingLinks.length);
        window.location.href = matchingLinks[randomIndex];
    }
}

function setButtonDisabled() {
    button.textContent = "停止"
    button.disabled = true;
}

// 添加“开始/停止”按钮
var button = document.createElement("button");
button.style.position = "fixed";
button.style.right = "15%";
button.style.bottom = "30%";
button.style.transform = "translateY(-50%)";
button.style.padding = "10px 20px";
button.style.fontSize = "20px";
button.style.backgroundColor = "#f0f0f0"; // 浅灰色背景
button.style.border = "1px solid #ddd"; // 浅灰色边框
button.style.padding = "10px 20px"; // 内边距
button.style.borderRadius = "5px"; // 圆角
button.style.color = "black";
button.textContent = "开始";
document.body.appendChild(button);

button.addEventListener("click", function() {
    if (isScrolling) {
        stopScrolling();
    } else {
        startScrolling();
    }
});

if (window.location.href.indexOf("/t/topic/") != -1) {
    // 如果在主题页面，默认就开始滚动
    startScrolling();
} else {
    findLinkAndRedirect();
    setButtonDisabled();
}
