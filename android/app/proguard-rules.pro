# Android Browser Helper rules
-keepattributes *Annotation*
-dontwarn com.google.androidbrowserhelper.**
-keep class com.google.androidbrowserhelper.** { *; }

# Google Play Billing rules
-dontwarn com.android.billingclient.**
-keep class com.android.billingclient.** { *; }
