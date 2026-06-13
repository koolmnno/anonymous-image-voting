# Render 部署说明

这个项目已经加入 `render.yaml`，可以用 Render Blueprint 一键部署。

## 部署前准备

1. 把当前项目上传到 GitHub 仓库。
2. 登录 Render。
3. 选择 `New` → `Blueprint`。
4. 选择你的 GitHub 仓库。
5. Render 会自动读取 `render.yaml` 并创建 Web Service。
6. 点击确认部署。

部署完成后，Render 会给出一个公网域名，格式通常类似：

```text
https://anonymous-image-voting-site.onrender.com
```

实际域名以 Render 页面显示为准。

## 已配置内容

- `buildCommand`: `npm install`
- `startCommand`: `npm start`
- `healthCheckPath`: `/api/health`
- 持久化磁盘挂载路径：`/var/data`
- 上传图片保存位置：`/var/data/uploads`
- 投票数据保存位置：`/var/data/data/images.json`

## 注意事项

- Render 免费服务长时间无人访问后可能休眠，首次打开会比较慢。
- 免费服务的持久化磁盘能力可能受账号和套餐限制；如果页面提示无法创建磁盘，请改用付费实例或云服务器部署。
- 如果不配置持久化磁盘，服务重启后上传图片和投票数据可能丢失。
