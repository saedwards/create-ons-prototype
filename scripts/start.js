import nunjucks from 'nunjucks';
import express from 'express';

const app = express();
const PORT = 5088;

function boot() {
  nunjucks.installJinjaCompat();

  const nunjucksEnv = nunjucks.configure([
    './src',
    //'./node_modules/@ons/pattern-library-v2/0.1.5/src/',
    './node_modules/@ons/pattern-library-v2/0.1.5/src/',
  ], {
    cache: false,
    express: app,
    watch: true
  });

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
