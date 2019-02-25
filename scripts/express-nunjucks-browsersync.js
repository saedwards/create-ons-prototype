import nunjucks from 'nunjucks';
import express from 'express';
import browserSync from 'browser-sync';
import connectBrowserSync from 'connect-browser-sync';
import { rollup } from 'rollup';

const PORT = 5090;
const root = './src/';

export default function expressNunjucks(port) {
  nunjucks.installJinjaCompat();

  const app = express(),

    nunjucksEnv = nunjucks.configure([
      root,
      './node_modules/@ons'
    ], {
      cache: false,
      express: app,
      watch: true
    }),

    bs = browserSync.create().init({
      files: [root + '**/*.*'],
      logSnippet: false
    });

  app.use(connectBrowserSync(bs));
  app.engine( 'njk', nunjucksEnv.render );

  app.get('(/*.html$)?', (req, res) => res.render(req.params[1] + '.njk'));

  app.get('(/*.js$)?', async (req, res) =>
    rollup({input: root + req.params[0]})
      .then(bundle => bundle.generate({ format: 'cjs' }))
      .then(({ output = [] }) => res.send(output.map(chunk => chunk.code).join('')))
  );

  app.get('(/*)?', (req, res) => res.sendFile(req.params[1], { root: root }));

  app.listen(port);
  console.log(`Running on port ${port}`);
}

expressNunjucks(PORT);
