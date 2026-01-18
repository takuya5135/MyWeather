# GitHub & Vercel デプロイ手順

このアプリケーションをインターネット上で公開するための手順です。

## 1. 前提条件
- **GitHubアカウント** を持っていること
- **Vercelアカウント** を持っていること (GitHubアカウントでログイン可能)
- パソコンに **Git** がインストールされていること

## 2. GitHubリポジトリの作成

1. [GitHub](https://github.com/new) にアクセスして、新しいリポジトリを作成します。
   - **Repository name**: `weather-matome` (または好きな名前)
   - **Public** (公開) または **Private** (非公開) を選択
   - "Initialize this repository with..." のチェックボックスは **全て外したまま** にしてください。
2. "Create repository" ボタンを押します。
3. 作成後の画面に表示される以下のコマンドをコピーしておきます。
   ```bash
   git remote add origin https://github.com/YourUserName/weather-matome.git
   git branch -M main
   git push -u origin main
   ```

## 3. ローカルでのコマンド実行

このフォルダ (`weather-matome`) で、以下のコマンドを順番に実行します（ターミナル・PowerShellで実行）。

```bash
# 1. Gitの初期化
git init

# 2. ファイルをステージング
git add .

# 3. コミット (保存)
git commit -m "Initial commit"

# 4. GitHubと連携 (さっきコピーしたURLを使ってください)
# 例: git remote add origin https://github.com/ユーザー名/weather-matome.git
git remote add origin <あなたのGitHubリポジトリURL>

# 5. GitHubへアップロード
git branch -M main
git push -u origin main
```

## 4. Vercelへのデプロイ

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセスします。
2. **"Add New..."** -> **"Project"** をクリックします。
3. "Import Git Repository" の画面で、先ほどアップロードした **`weather-matome`** リポジトリの横にある **"Import"** ボタンを押します。
4. 設定画面が表示されますが、Next.jsプロジェクトなので基本的にそのままで大丈夫です。
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
5. **"Deploy"** ボタンを押します。

しばらく待つと、花吹雪のアニメーションと共にデプロイが完了します！
発行されたURL（例: `weather-matome.vercel.app`）にアクセスして動作を確認してください。

## 補足: 環境変数について
このアプリは現在、APIキーなどの秘密情報を使用していないため、環境変数の設定は不要です。
将来的に有料の天気APIなどを使う場合は、Vercelの Settings -> Environment Variables で設定する必要があります。
