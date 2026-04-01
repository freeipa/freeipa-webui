import React from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import {
  Command,
  FindRPCResponse,
  useSimpleMutCommandMutation,
} from "src/services/rpc";
import {
  countHealthcheckResultsBySeverity,
  formatHealthcheckRpcError,
  formatHealthcheckTransportError,
  normalizeHealthcheckResult,
  parseHealthcheckLogShowBody,
  type HealthcheckCommandPayload,
  type HealthcheckSeverityCounts,
} from "src/pages/Healthcheck/healthcheckUtils";
import { DEFAULT_HEALTHCHECK_REPORT_FILE } from "src/pages/Healthcheck/healthcheckConstants";

/** Shape returned by ``useHealthcheckData`` (data, meta, loading, counts, reload). */
export type UseHealthcheckDataResult = {
  checksData: unknown | null;
  meta: Omit<HealthcheckCommandPayload, "result"> | null;
  isLoading: boolean;
  cachedSeverityCounts: HealthcheckSeverityCounts | null;
  reload: () => void;
};

/**
 * Loads and normalizes healthcheck JSON via ``healthcheck_log_show`` (same pattern
 * as other ``use*Data`` hooks). Auto-fetches on mount; ``reload`` repeats the RPC.
 * Clears data and counts on transport, IPA, parse, or unhandled errors.
 */
export function useHealthcheckData(): UseHealthcheckDataResult {
  const dispatch = useAppDispatch();
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [runHealthcheckLogShow, { isLoading }] = useSimpleMutCommandMutation();
  const [checksData, setChecksData] = React.useState<unknown | null>(null);
  const [meta, setMeta] = React.useState<Omit<
    HealthcheckCommandPayload,
    "result"
  > | null>(null);
  const [cachedSeverityCounts, setCachedSeverityCounts] =
    React.useState<HealthcheckSeverityCounts | null>(null);

  /** Calls ``healthcheck_log_show`` with the default report path and updates state. */
  const reload = React.useCallback(() => {
    const opts: Record<string, unknown> = {
      version: apiVersion,
      report_file: DEFAULT_HEALTHCHECK_REPORT_FILE,
    };
    const command: Command = {
      method: "healthcheck_log_show",
      params: [[], opts],
    };

    runHealthcheckLogShow(command)
      .then((response) => {
        if ("error" in response && response.error !== undefined) {
          dispatch(
            addAlert({
              name: "healthcheck-log-show-error",
              title: formatHealthcheckTransportError(response.error),
              variant: "danger",
            })
          );
          setChecksData(null);
          setMeta(null);
          setCachedSeverityCounts(null);
          return;
        }
        if ("data" in response && response.data) {
          const data = response.data as FindRPCResponse;
          if (data.error) {
            dispatch(
              addAlert({
                name: "healthcheck-log-show-ipa-error",
                title: formatHealthcheckRpcError(data.error),
                variant: "danger",
              })
            );
            setChecksData(null);
            setMeta(null);
            setCachedSeverityCounts(null);
            return;
          }
          const parsed =
            parseHealthcheckLogShowBody(data.result) ??
            parseHealthcheckLogShowBody(data.result?.result);
          if (parsed) {
            const normalized = normalizeHealthcheckResult(parsed.result ?? null);
            setChecksData(normalized);
            setCachedSeverityCounts(
              countHealthcheckResultsBySeverity(normalized)
            );
            setMeta({
              raw: parsed.raw,
              returncode: parsed.returncode,
              healthcheck_version: parsed.healthcheck_version,
              ipa_version: parsed.ipa_version,
              pki_version: parsed.pki_version,
              output_file: parsed.output_file,
            });
          } else {
            setChecksData(null);
            setMeta(null);
            setCachedSeverityCounts(null);
          }
        }
      })
      .catch((err: unknown) => {
        dispatch(
          addAlert({
            name: "healthcheck-log-show-unhandled",
            title: formatHealthcheckTransportError(err),
            variant: "danger",
          })
        );
        setChecksData(null);
        setMeta(null);
        setCachedSeverityCounts(null);
      });
  }, [apiVersion, dispatch, runHealthcheckLogShow]);

  /** Initial load when the hook mounts (and when ``reload`` identity changes). */
  React.useEffect(() => {
    reload();
  }, [reload]);

  return {
    checksData,
    meta,
    isLoading,
    cachedSeverityCounts,
    reload,
  };
}
