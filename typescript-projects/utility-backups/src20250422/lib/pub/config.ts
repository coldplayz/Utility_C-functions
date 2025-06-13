/**
 * Note
 * Cloud Pub/Sub helper
 * @PubTopic hold all available topics
 * @message send message to a topic
 * You can init more project by providing there service account in env
 */

// import { PubSub } from "@google-cloud/pubsub";
// import { logger } from "../../helpers/@logger";

// const coreProjectID = "";
// const coreProjectPubSA = JSON.parse(process.env.CORE_PROJECT_PUB_SA as string);

// const coreProjectPub = new PubSub({
//     projectId: coreProjectID,
//     credentials: coreProjectPubSA,
// });

// enum PubTopic {
//     REDEEM_REFERRAL_POINT = "redeem-referral-point"
// }

// export default class initPub {

//     constructor() {
//     }

//     static corePub = coreProjectPub

//     static async message(topic: PubTopic, body: any, header: any, pub: PubSub) {
//         try {
//             const data = Buffer.from(JSON.stringify(body));
//             const message = { data, attributes: header };
//             await pub.topic(topic).publishMessage(message);
//         } catch (error) {
//             const message = `unable to publish to topic ${topic}`;
//             logger.log({ level: 'error', message, severity: "Error", error })
//             throw new Error(message);
//         }
//     }
// }

/** Usage
 * const body = { userId: "XXX", points: 100 };
 * const header = { jwt: "secret jwt" };
 * initPub.message(PubTopic.REDEEM_REFERRAL_POINT, body, header, initPub.corePub)
 */
