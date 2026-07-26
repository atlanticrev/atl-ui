# Публикация `@atlanticrev/atl-ui-vanilla`

Пакет публикуется вручную в GitHub Packages. GitHub Actions не публикует пакет автоматически при push
тега: workflow `Verify ATL UI Vanilla release` оставлен только как необязательная ручная проверка.

## Что делает команда

Команда `npm run publish:vanilla`:

1. требует `GITHUB_TOKEN`, но не печатает и не сохраняет его;
2. проверяет registry, совпадение версии пакета и публичной константы;
3. разрешает публикацию только из чистой ветки `main`, совпадающей с локальным `origin/main`;
4. проверяет авторизацию и отсутствие этой версии в GitHub Packages;
5. запускает полный vanilla gate и установку tarball в чистый consumer project;
6. публикует workspace `@atlanticrev/atl-ui-vanilla`.

## Подготовка токена

Нужен GitHub personal access token classic со scope `read:packages` и `write:packages`. Аккаунт владельца
токена должен иметь write-доступ к пакету и репозиторию. Fine-grained PAT для GitHub Packages npm registry
не поддерживается. Требования сверены с официальной документацией GitHub по
[npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
и [package permissions](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages).

Не вставляйте токен прямо в команду: так он может попасть в историю shell. Считайте его скрыто в переменную
окружения:

```bash
read -s GITHUB_TOKEN
export GITHUB_TOKEN
```

## Выпуск

Сначала получите актуальный release commit в `main`:

```bash
git switch main
git pull --ff-only origin main
```

Затем выполните единственную команду публикации:

```bash
npm run publish:vanilla
```

После успешной публикации удалите токен из окружения и зафиксируйте release commit тегом:

```bash
unset GITHUB_TOKEN
git tag -a atl-ui-vanilla-v0.5.0 -m "@atlanticrev/atl-ui-vanilla 0.5.0"
git push origin atl-ui-vanilla-v0.5.0
```

Если команда завершилась ошибкой, тег создавать не нужно. Повторный запуск безопасен: команда заранее
проверяет, опубликована ли уже текущая версия.
