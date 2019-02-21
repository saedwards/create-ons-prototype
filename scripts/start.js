import nunjucks from 'nunjucks';
import express from 'express';
import browserSync from 'browser-sync';
import connectBrowserSync from 'connect-browser-sync';

const app = express();
const PORT = 5088;

function boot() {
  nunjucks.installJinjaCompat();

  const nunjucksEnv = nunjucks.configure([
    './src',
    './node_modules/@ons'
  ], {
    cache: false,
    express: app,
    watch: true
  });

  const bs = browserSync.create().init({
    files: ['src/**/*.*'],
    logSnippet: false
  });

  app.use(connectBrowserSync(bs));
  app.engine( 'njk', nunjucksEnv.render );

  app.get('(/*)?', function(req, res) {
    const route = req.params[1],
      isAssets = route.match(/assets/g);

    !isAssets
      ? res.render(route + '.njk')
      : res.sendFile(route, { root: './src/' });
  });

  app.listen(PORT);
  console.log(`Running on port ${PORT}`);
}

boot();
