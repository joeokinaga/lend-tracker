# LINE 側の初期設定 手順書

> この手順は、LINE Developers コンソールと LINE Official Account Manager で**あなたが**行います。画面の名前は変わることがあります。違っていたら教えてください。手順書を直します。
> **開発用と本番用で、同じ手順を2回**行います（プロバイダーを分けます。ユーザーIDはプロバイダーごとに違うので、データが混ざりません）。

## 0. 準備
- LINE Developers にログインする：https://developers.line.biz/console/
- 名前を決める（例）：開発用 `lend-tracker-dev`、本番用 `lend-tracker`

## 1. プロバイダーを作る
1. コンソールで「作成」→ プロバイダー名を入力（開発用：`lend-tracker-dev`）
2. 以下のチャネルは、**すべてこのプロバイダーの中に**作る（同じプロバイダーでないと、ログインのユーザーIDと通知の送り先のユーザーIDが一致しない）

## 2. Messaging API チャネル（＝公式アカウント）を作る
1. LINE Official Account Manager で公式アカウントを作る。作成の途中で、手順1のプロバイダーを選んで Messaging API を有効にする
   - 参考：https://developers.line.biz/en/docs/messaging-api/getting-started/
2. プランが「コミュニケーションプラン（無料）」になっていることを確かめる
3. Official Account Manager の応答設定：
   - 「チャット」：オフ（今回は使わない）
   - 「あいさつメッセージ」：オン（例：「友だち追加ありがとうございます。貸し借りの期限が近づくと、ここでお知らせします。」）
   - 「Webhook」：オン
   - 「応答メッセージ」：オフ
4. コンソールの Messaging API チャネルで、次の値を控える（**チャットや Git には貼らないでください**）
   - 「チャネル基本設定」→ チャネルシークレット → 後で `LINE_CHANNEL_SECRET` に設定する
   - 「Messaging API設定」→ チャネルアクセストークン（長期）を発行 → 後で `LINE_CHANNEL_ACCESS_TOKEN` に設定する
   - 「Messaging API設定」→ ボットのベーシックID（`@xxxx`）と友だち追加用のURL → 秘密情報ではないので、私に伝えて大丈夫です
5. Webhook URL は、デプロイ後に `https://<worker のドメイン>/webhook/line` を設定し、「Webhookの利用」をオンにする（タスクの実装後に案内します）

## 3. LINE ログインチャネルを作る
1. 同じプロバイダーの中で「新規チャネル作成」→「LINEログイン」
2. アプリタイプ：「ウェブアプリ」
3. 「チャネル基本設定」→「リンクされたLINE公式アカウント」で、手順2のアカウントを選ぶ（両方の管理者である必要がある）
   - 参考：https://developers.line.biz/en/docs/line-login/link-a-bot/
4. チャネルID を控える → 後で `LINE_LOGIN_CHANNEL_ID` に設定する（秘密情報ではない）

## 4. LIFF アプリを登録する
1. LINE ログインチャネルの「LIFF」タブ →「追加」
2. 設定：
   - サイズ：Full
   - エンドポイントURL：開発用は後で決める（ローカルの確認には HTTPS が必要なので、`cloudflared` などのトンネルを使う。タスクの中で案内します）。本番用はデプロイ後の URL
   - Scope：`openid` と `profile` を**両方**オンにする（IDトークンと友だち状態の取得に必要）
   - 友だち追加オプション：On (Aggressive)（ログインのあとに、友だち追加の画面を出す）
   - Scan QR：オフ
3. 発行された LIFF ID を控える → `VITE_LIFF_ID` に設定する（秘密情報ではない）
4. 「シェアターゲットピッカー」：チャネルの設定でオンにする（招待リンクをLINEで送るのに使う。オンにできない場合は、リンクのコピーで代わりにする）
   - 参考：https://developers.line.biz/en/reference/liff/

## 5. 動作確認（設定が終わったら）
1. 自分のスマホで、公式アカウントの友だち追加URLを開き、友だち追加する
2. 手順2-4 の「あいさつメッセージ」が届けば、Messaging API チャネルは正しく作れています
3. アプリが動くようになったら、LIFF の URL（`https://liff.line.me/<LIFF ID>`）を LINE のトークに貼ってタップし、ログインと友だち状態が表示されるかを確かめる（タスクの中で案内します）

## 6. 私に伝えてほしい値・伝えてはいけない値
| 値 | 伝えてよいか | 使う場所 |
|---|---|---|
| LIFF ID | 伝えてよい | `VITE_LIFF_ID` |
| ログインチャネルID | 伝えてよい | `LINE_LOGIN_CHANNEL_ID` |
| ボットのベーシックID / 友だち追加URL | 伝えてよい | 画面の案内 |
| チャネルシークレット | **伝えない** | `.dev.vars` / `wrangler secret put` に自分で入れる |
| チャネルアクセストークン | **伝えない** | 同上 |
