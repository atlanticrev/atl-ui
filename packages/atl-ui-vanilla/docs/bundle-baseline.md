# Build-size baseline

Это build-level baseline до отдельного Chrome measurement. Source maps и declarations не считаются.
Gzip для ESM указан как сумма отдельных HTTP-файлов, включая shared chunks.

| Entry | Raw | Gzip |
|---|---:|---:|
| Input JS | 8.83 KB | 3.27 KB |
| Select JS | 20.14 KB | 7.40 KB |
| Tabs JS | 5.59 KB | 2.52 KB |
| Toast JS | 6.57 KB | 2.93 KB |
| All pilot JS, shared chunks deduplicated | 35.40 KB | 13.37 KB |
| `core.css` | 3.09 KB | 0.93 KB |
| `theme.css` | 35.42 KB | 6.25 KB |
| `default.css` | 38.44 KB | 6.99 KB |

`npm pack --dry-run` подтверждает отсутствие bundled dependencies. Реальные transfer, parse/evaluate,
long tasks, memory и Web Vitals нужно измерить в production build `social-video-posting` через Chrome.
