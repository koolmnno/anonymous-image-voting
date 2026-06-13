# GitHub Pages + 图床 + 共享数据库版

这个目录用于 GitHub Pages 发布。

## 架构

- GitHub Pages：托管静态网页
- ImgBB：保存图片文件
- Bmob：保存共享图片列表和投票数据
- 浏览器 localStorage：保存匿名身份和配置

## 需要准备

### ImgBB

申请地址：`https://api.imgbb.com/`

复制 `API Key`，填到页面的 `ImgBB API Key`。

### Bmob

1. 注册并登录 Bmob。
2. 创建一个应用。
3. 进入应用的“应用密钥”。
4. 复制 `Application ID`。
5. 复制 `REST API Key`。
6. 填到页面的 Bmob 配置里并保存。

首次上传图片时，页面会自动在 Bmob 创建 `ImageVoteImage` 数据表。

## 重要限制

GitHub Pages 是静态托管，本身没有数据库；共享能力来自 Bmob。

配置 Bmob 后：

- 不同用户能看到同一批图片
- 不同用户能看到共享投票结果
- 匿名投票身份仍保存在浏览器本地

未配置 Bmob 时：

- 自动退回本地模式
- 图片列表和投票数据只保存在当前浏览器
