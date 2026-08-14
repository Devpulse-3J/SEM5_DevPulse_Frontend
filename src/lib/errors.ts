/**
 * Thrown by service functions whose backend endpoint does not exist yet.
 *
 * Why this exists: the alternative is scattering try/catch around calls to URLs
 * that 404, which makes a missing feature look like a transient network fault.
 * A distinct error type lets hooks render an honest "not implemented" state and
 * keeps every gap discoverable by searching for this one symbol.
 */
export class NotImplementedError extends Error {
  /** The feature the caller was trying to use, e.g. "DORA metrics". */
  readonly feature: string;
  /** The service that must ship before this works, when known. */
  readonly blockedOn?: string;

  constructor(feature: string, blockedOn?: string) {
    super(
      blockedOn
        ? `${feature} is not available yet — blocked on ${blockedOn}.`
        : `${feature} is not available yet.`
    );
    this.name = "NotImplementedError";
    this.feature = feature;
    this.blockedOn = blockedOn;
  }
}

/** Shape returned by hooks whose endpoint does not exist. */
export interface UnavailableResult {
  data: undefined;
  isUnavailable: true;
  isLoading: false;
  isError: false;
  /** Human-readable reason, safe to render. */
  reason: string;
}

/** Builds the constant result an unavailable hook returns. */
export function unavailable(feature: string, blockedOn?: string): UnavailableResult {
  return {
    data: undefined,
    isUnavailable: true,
    isLoading: false,
    isError: false,
    reason: blockedOn
      ? `${feature} requires ${blockedOn}, which is not yet implemented`
      : `${feature} is not yet implemented`,
  };
}
