import nunjucks from 'nunjucks';
import express from 'express';
import browserSync from 'browser-sync';
import connectBrowserSync from 'connect-browser-sync';

const PORT = 5090;

export default function expressNunjucks(port) {
  nunjucks.installJinjaCompat();

  const app = express(),

    nunjucksEnv = nunjucks.configure([
      './src',
      './node_modules/@ons'
    ], {
      cache: false,
      express: app,
      watch: true
    }),

    bs = browserSync.create().init({
      files: ['src/**/*.*'],
      logSnippet: false
    });

  app.use(connectBrowserSync(bs));
  app.engine( 'njk', nunjucksEnv.render );

  app.get('(/*)?', function(req, res) {
    const route = req.params[1],
      isAssets = route.match(/assets/g),
      isCssFile = route.match(/.css?/);

    !isAssets && !isCssFile
      ? res.render(route + '.njk')
      : res.sendFile(route, { root: './src/' });
  });

  app.listen(port);
  console.log(`Running on port ${port}`);
}

expressNunjucks(PORT);
