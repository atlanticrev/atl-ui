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

## Full component set

После переноса всех 22 компонентов сумма отдельных ESM entry/shared files составляет `93.46 KB` raw и
`35.29 KB` gzip. Это верхняя граница для `define-all`: точечные entry points загружают только свои shared
chunks. Актуальные CSS: `core.css` — `4.24/1.14 KB`, `theme.css` — `46.71/7.80 KB`, `default.css` —
`50.88/8.79 KB` raw/gzip.

Production showcase после общего Rollup tree shaking занимает `95.42 KB` raw / `25.94 KB` gzip JS и
`54.18 KB` raw / `9.40 KB` gzip CSS. Это не метрика приложения: showcase намеренно регистрирует все
элементы. Route-level imports в `social-video-posting` должны быть меньше.

`npm pack --dry-run` подтверждает отсутствие bundled dependencies. Functional Chrome QA пройден на
desktop и `390×844`; transfer, parse/evaluate, long tasks, memory и Web Vitals всё ещё нужно измерить в
production build `social-video-posting` после его миграции.
