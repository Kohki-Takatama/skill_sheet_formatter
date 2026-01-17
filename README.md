# Skill Sheet Formatter PoC

エンジニア向けスキルシート更新のPoCデモです。Next.js(App Router) + TypeScript + Tailwind + shadcn/ui をベースにしています。

## 起動手順

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 依存追加

- UI: shadcn/ui + Radix UI
- PDF生成: `jspdf`

主要な依存は `package.json` に含めています。

## shadcn/ui セットアップ手順

> 既に必要なコンポーネントは `components/ui` 配下に手動追加済みです。再生成したい場合は以下を参考にしてください。

1. `npx shadcn-ui@latest init` を実行
2. `components.json` の設定に合わせて `components/ui` に配置
3. 必要に応じて以下のコンポーネントを追加
   - button, card, input, textarea, select, table, dialog, checkbox, toast

## 概要

- プロフィール: 固定情報、資格、スキル棚卸し、スキル要約を保存
- 案件履歴: 追加/編集/削除の一覧管理
- 出力センター: 最大5件選択、PDF出力、スキル一覧コピー
- すべて `localStorage` に保存し、初回はサンプルデータを投入
