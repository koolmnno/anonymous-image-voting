package com.anonymous.voting;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private String nativeDeviceId;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        nativeDeviceId = buildAllowedDeviceId();

        webView = new WebView(this);
        setContentView(webView);

        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        );

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + " AnonymousImageVotingApp/1.0");

        webView.addJavascriptInterface(new AndroidDeviceBridge(), "AndroidDevice");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl(getString(com.anonymous.voting.R.string.site_url));
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    private String buildAllowedDeviceId() {
        String androidId = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
        String source = "android_id=" + safe(androidId)
                + "|package=" + getPackageName()
                + "|brand=" + safe(android.os.Build.BRAND)
                + "|model=" + safe(android.os.Build.MODEL)
                + "|manufacturer=" + safe(android.os.Build.MANUFACTURER);
        return "android_" + sha256(source);
    }

    private static String safe(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                builder.append(String.format(Locale.ROOT, "%02x", bytes[i]));
            }
            return builder.toString();
        } catch (Exception error) {
            return String.valueOf(Math.abs(value.hashCode()));
        }
    }

    public class AndroidDeviceBridge {
        @JavascriptInterface
        public String getDeviceId() {
            return nativeDeviceId;
        }

        @JavascriptInterface
        public String getIdSource() {
            return "ANDROID_ID_HASH";
        }
    }
}
