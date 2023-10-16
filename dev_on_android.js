/**
 * create a bookmark and copy and paste the code below as its URL.
 *
 * on any site you want to inspect its elements, click the bookmark, and wait a moment for a button to appear at bottom-right of screen.
 *
 * click on appearing button to toggle developer console.
 */

javascript:(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  document.body.appendChild(script);
  script.onload = function () {
    eruda.init();
  }
})();
