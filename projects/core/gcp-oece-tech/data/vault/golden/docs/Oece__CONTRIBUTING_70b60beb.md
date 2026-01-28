# Contributing to OECE

感謝你想為 OECE 貢獻！

- 請先在本地 fork/clone。提交前請確保遵守隱私與安全規範。
- 嚴禁提交迷因、表情包或不相關的圖像。
- 圖檔請上傳 SVG 或高解析圖並附上 checksum（SHA256）。
- 所有修改應附上來源與授權聲明。

## 圖檔與 checksum / Images & checksums

- 新增或更新圖檔後，請在 `assets/` 目錄執行以下命令生成檢查碼檔案：

```bash
sha256sum assets/* > assets/checksums.sha256
```

- 提交前請執行 `sh scripts/verify-assets.sh` 以確認檔案完整性。

## 禁止表情包 / No emojis or memes


- 嚴禁上傳含有表情包或迷因內容的圖像。倉庫會在 CI 或 pre-commit hook 中執行簡單檢查，範例：

  - 使用 `git grep -I --line-number "emoji"` 或對圖檔名稱/metadata 做檢查。
  - 可在 CI 中加入圖像辨識或檔名白名單。

請在 PR 描述中說明你加入的圖檔來源與用途。
Thank you for contributing to OECE!

- Fork/clone locally and follow privacy & security guidelines.
- No memes/emojis or unrelated images.
- Images must be SVG or hi-res and include checksum (SHA256).
- Provide source and licensing for any added materials.
