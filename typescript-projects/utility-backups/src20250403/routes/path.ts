// import ObjectValidator from "../helpers/@objectValidator";
import { MicroServiceRoutePath } from "../interface/types";

export const routePath: MicroServiceRoutePath = {
  serviceStatus: "/status",
  processBill: "/bill/process",
  approveBill: "/bill/approve",
  reverseBill: "/bill/reverse",
  //   // TODO: remove unused routes
  //   time: "/time",
  //   serviceError: "/error",
  //   onlySuperAdminPath: "/super/hello",
  //   onlySpecifiedAdminPath: "/specified/hello",
} as const;

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
