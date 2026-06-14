# 图片投票 Android APK

这是一个简易 Android App 外壳，启动后用 WebView 打开线上投票网站：

```text
https://koolmnno.github.io/anonymous-image-voting/
```

## 设备 ID 方案

App 会读取 Android 允许普通应用访问的 `Settings.Secure.ANDROID_ID`，再结合包名和设备基础信息做 SHA-256 哈希，生成：

```text
android_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

网页会优先读取 App 注入的 `AndroidDevice.getDeviceId()`，如果不是在 APK 中打开，则回退到浏览器设备指纹。

## 重要限制

Android 10 以后，普通 App 不能读取 IMEI、MAC 地址、硬件序列号等真实硬件唯一编号。这个项目不会绕过系统隐私限制。

如果要更严格的一人一票，仍建议以手机号验证码注册为准，设备 ID 只作为辅助识别。

## 本地构建

需要安装：

```text
Android Studio
JDK 17
Android SDK 35
Gradle
```

导入 `android-apk` 文件夹后，执行：

```bash
./gradlew assembleDebug
```

生成文件：

```text
app/build/outputs/apk/debug/app-debug.apk
```
