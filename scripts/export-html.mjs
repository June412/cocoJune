import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { build } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// A classic inline script works with file://; ES module scripts need an HTTP server.
const result = await build({
  root,
  base: './',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'import.meta.env.BASE_URL': JSON.stringify('./public/'),
  },
  build: {
    write: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(root, 'src/main.tsx'),
      name: 'JunyanHePortfolio',
      formats: ['iife'],
      fileName: 'portfolio',
    },
  },
})

const output = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output)
const scripts = output.filter((item) => item.type === 'chunk')
const styles = output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
if (scripts.length !== 1 || styles.length !== 1) {
  throw new Error('Expected one classic script and one stylesheet for the HTML export.')
}
const script = scripts[0].code.replace(/<\/script/gi, '<\\/script')
// Public files stay beside this HTML in public/. Inline CSS resolves URLs relative to the HTML.
const css = String(styles[0].source)
  .replace(/url\((['"]?)\.\.\//g, 'url($1./public/')
  .replace(/url\((['"]?)\/(?!\/)/g, 'url($1./public/')
  .replace(/<\/style/gi, '<\\/style')
const template = await readFile(resolve(root, 'index.html'), 'utf8')
const html = template
  .replace('href="/favicon.svg"', 'href="./public/favicon.svg"')
  .replace('</head>', () => `<style>${css}</style>\n  </head>`)
  .replace(/<script type="module" src="\/src\/main\.tsx"><\/script>/, () => `<script>${script}</script>`)
const destination = resolve(root, 'Junyan-He.html')
await writeFile(destination, html)
console.log(`HTML exported: ${destination}\nDouble-click this file to open the site. Keep the public folder beside it.`)
