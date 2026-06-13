# GitHub Pages + 第三方图床版

这个目录用于 GitHub Pages 发布。

## 图片上传

页面支持填写 `ImgBB API Key`，然后把图片上传到 ImgBB 图床。

申请地址：

```text
https://api.imgbb.com/
```

API Key 只保存在访问者自己的浏览器 `localStorage`，不会提交到 GitHub。

## 重要限制

GitHub Pages 是静态托管，没有后端数据库。

因此此版本采用：

- ImgBB 保存图片文件
- 浏览器 `localStorage` 保存图片 URL、投票数据和匿名身份

这意味着图片文件有公网外链，但图片列表和投票数据仍只保存在当前访问者的浏览器里，不同用户之间不会自动共享图片列表和投票结果。

如果需要真实多人共享图片和投票，请使用：

- uniCloud
- 微信云开发
- CloudBase
- 云服务器
