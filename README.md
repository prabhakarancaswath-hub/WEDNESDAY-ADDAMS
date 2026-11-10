# Wednesday — Personal Assistant

A local-first productivity companion packaged for Windows desktop and Android.

## Included
- Dashboard, task list, project progress, manual INR income/expense log
- Wellbeing journal, personal notes and JSON backup export
- Local assistant interface with basic answers from saved tasks/projects/budget
- Windows desktop packaging with Electron
- Android packaging with Capacitor
- Dedicated Wednesday SVG logo and app identity

## Build
Requires Node.js 20+.

    npm install
    npm run build

### Windows installer
On Windows:

    npm run desktop:dist

Installer output: release/*.exe

### Android APK
Requires Android Studio / Android SDK and JDK 21:

    npm run build
    npx cap add android
    npx cap sync android
    cd android
    ./gradlew assembleDebug

APK output: android/app/build/outputs/apk/debug/app-debug.apk

GitHub Actions workflow "Build Wednesday apps" builds both artifacts. Open the Actions tab, run the workflow, then download the Windows installer and Android APK from the workflow artifacts.

## Important limitations
This is a working offline-first v1. Data is stored locally on each installation/browser profile. There is no account system, cloud sync, live GPT connection, bank connection, broker connection, automatic phone usage monitoring or medical monitoring yet. The assistant is a basic local helper, not a live AI model. Do not put API keys in frontend code. A secure backend and explicit account/consent design are required before enabling cloud AI or sync.

## Privacy
Your notes, tasks and manual records stay in local app storage. Export a JSON backup before clearing data or uninstalling.
