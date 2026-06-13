# 匿名图片投票网站

这是一个简单的图片上传和匿名投票网站。

## 功能

- 上传图片并填写标题
- 图片墙展示所有已上传图片
- 匿名投票和取消投票
- 按票数从高到低排序
- 每个浏览器通过匿名 Cookie 识别投票状态

## 运行方式

```bash
npm install
npm start
```

启动后打开：

```text
http://localhost:3000
```

## 数据位置

- 上传图片保存到 `uploads/`
- 图片和投票数据保存到 `data/images.json`

如果部署到云平台，可以通过环境变量指定持久化目录：

```bash
UPLOAD_DIR=/var/data/uploads DATA_DIR=/var/data/data npm start
```

## Render 部署

项目已包含 `render.yaml`。把项目上传到 GitHub 后，在 Render 里选择 `New` → `Blueprint`，选择仓库并确认部署即可。

详细步骤见 `DEPLOY_RENDER.md`。

## 说明

匿名投票不需要账号。系统会给访问者浏览器写入一个匿名 Cookie，用于避免同一浏览器对同一张图片重复投票。
