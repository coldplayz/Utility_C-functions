// /*
// Uncomment the code below to initialize Firebase.
// It supports mutiple firebase project.
// Also import firebase.ts into the index.ts file.
// */


import 'dotenv/config';
import { initializeApp, cert, getApps, getApp, applicationDefault } from 'firebase-admin/app';
interface initConfig {
    appName: string,
    config?: string,
    storageBucket?: string
}

class initApp {
    static getInit(appName: string) {
        const apps = getApps().map(apps => apps.name);
        return apps.includes(appName) ? true : false;
    }

    static init({ appName, config, storageBucket }: initConfig) {
        try {
            if (!config || config === undefined) throw { message: `config not found for ${appName}` }

            return initApp.getInit(appName) ? getApp(appName) : initializeApp({
                credential: cert(JSON.parse(config)),
                storageBucket
            }, appName)
        }
        catch (error) {
            throw { message: `unable to connect to ${appName} firebase project` }
        }
    }
    static naira() {
        return initApp.getInit('[DEFAULT]') ? getApp() : initializeApp({
            credential: cert(JSON.parse(process.env.NAIRA_PROJECT_SA || "")),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            databaseURL: process.env.REALTIME_DB_URL
        });
    }

    static default() {
        return initApp.getInit('[DEFAULT]') ? getApp() : initializeApp({
            credential: applicationDefault(),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            databaseURL: process.env.REALTIME_DB_URL
        });
    }

    static giftcard() {
        return initApp.init({ appName: "giftcard", config: process.env.GIFTCARD_PROJECT_SA });
    }

    static crypto() {
        return initApp.init({ appName: "crypto", config: process.env.BITCOIN_PROJECT_SA });
    }

    static core() {
        return initApp.init({ appName: "users", config: process.env.USERS_PROJECT_SA });
    }
}

export default initApp;

