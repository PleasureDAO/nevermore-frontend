#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建项目
npm run build

# 进入生成的文件夹
cd build

git init
git add -A
git commit -m 'deploy'

# 如果使用 travis 持续集成
git push -f https://${GITHUB_TOKEN}@github.com/xxxx.git master:xxx

cd -