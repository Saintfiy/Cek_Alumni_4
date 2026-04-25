// Single Page Apps for GitHub Pages
// https://github.com/rafgraph/spa-github-pages
(function () {
  var segmentCount = 1;
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?/' +
    l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
    l.hash
  );
})();
