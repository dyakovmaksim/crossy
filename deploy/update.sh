#!/usr/bin/env bash
set -euo pipefail
# Запускать из корня репозитория на VPS после получения изменений.
cd "$(dirname "$0")/.."
npm ci
npm test
npm run build
site_dir=/var/www/crossy
release_id="$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
release_dir="$site_dir/releases/$release_id"
test ! -e "$release_dir"
mkdir -p "$release_dir"
cp -R dist/. "$release_dir/"
ln -s "releases/$release_id" "$site_dir/current.next"
mv -Tf "$site_dir/current.next" "$site_dir/current"
echo "Опубликована сборка $release_id. Предыдущие сборки сохранены в $site_dir/releases."
