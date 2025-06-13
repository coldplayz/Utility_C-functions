// import ObjectValidator from "../helpers/@objectValidator";
import { MicroServiceRoutePath } from "../interface/types";

export const routePath = {
  serviceStatus: "/status",
  processBet: "/bills/bet/process",
  processCableTv: "/bills/cableTv/process",
  processElectricity: "/bills/electricity/process",
  processMobile: "/bills/mobile/process",
  processStatus: "/bills/status/process",
} satisfies MicroServiceRoutePath;

// const OnlySuperAdminPathGuard = new ObjectValidator({
//   "worker.role": "required|array|in:super",
//   "worker.status": "required|string|in:active",
//   workerID: "required|string",
// });

// const OnlySpecifiedAdminPathGuard = new ObjectValidator({
//   "worker.role": "required|array|in:super",
//   "worker.status": "required|string|in:active",
//   workerID: "required|string",
// });

// export function RouteGuard(path: string) {
//   const guard: { [key: string]: ObjectValidator } = {
//     [routePath.onlySuperAdminPath]: OnlySuperAdminPathGuard,
//     [routePath.onlySpecifiedAdminPath]: OnlySpecifiedAdminPathGuard,
//   };

//   return guard[path.replace("/v2", "")];
// }
