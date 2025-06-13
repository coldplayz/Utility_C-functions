/**
 * Run any logic in dev/local environment only.
 * @param cb - callback to run.
 * @returns the callback's return value.
 */
export function runDev<Callback extends (...args: unknown[]) => unknown>(
  cb: Callback
) {
  if (/^dev/.test(process.env.NODE_ENV || "")) {
    return cb();
  }
  console.warn("runDev: not in 'dev*' environment!");
}
