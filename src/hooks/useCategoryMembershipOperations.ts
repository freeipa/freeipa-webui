import React from "react";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { containsAny } from "src/utils/utils";
import { ErrorResult } from "src/services/rpc";

/**
 * Configuration for a single membership tab (e.g., "Users", "Groups")
 */
export interface MembershipTabConfig<TAddResult, TRemoveResult> {
  name: string;
  type: string;
  addResultExtractor: (result: TAddResult) => {
    primary: string[];
    external?: string[];
  };
  removeResultExtractor: (result: TRemoveResult) => {
    remaining: string[];
    external?: string[];
    failed?: string[];
    error?: unknown;
  };
}

/**
 * Props for the useCategoryMembershipOperations hook
 */
interface UseCategoryMembershipOperationsProps<
  TAddPayload,
  TRemovePayload,
  TAddResult,
  TRemoveResult,
  TEntity,
> {
  entityId: string;
  entityName: string;
  categoryFieldName: string;
  tabs: MembershipTabConfig<TAddResult, TRemoveResult>[];
  addMutation: (
    payload: TAddPayload
  ) => Promise<{ data?: unknown; error?: unknown }>;
  removeMutation: (
    payload: TRemovePayload
  ) => Promise<{ data?: unknown; error?: unknown }>;
  saveMutation: (
    entity: Partial<TEntity>
  ) => Promise<{ data?: unknown; error?: unknown }>;
  createAddPayload: (type: string, members: string[]) => TAddPayload;
  createRemovePayload: (type: string, members: string[]) => TRemovePayload;
  modifiedValues: () => Partial<TEntity>;
  onRefresh: () => void;
}

/**
 * Return type for the hook
 */
interface MembershipOperationsResult {
  isSpinning: boolean;
  onAdd: (tabName: string, members: string[]) => void;
  onRemove: (tabName: string, members: string[]) => void;
  onSaveAndAdd: (tabName: string, members: string[]) => void;
}

/**
 * Generic hook for managing category-based membership operations.
 * Encapsulates add/remove/save-and-add patterns common to rule sections.
 */
export function useCategoryMembershipOperations<
  TAddPayload,
  TRemovePayload,
  TAddResult,
  TRemoveResult,
  TEntity extends { cn?: string },
>(
  props: UseCategoryMembershipOperationsProps<
    TAddPayload,
    TRemovePayload,
    TAddResult,
    TRemoveResult,
    TEntity
  >
): MembershipOperationsResult {
  const dispatch = useAppDispatch();
  const [isSpinning, setIsSpinning] = React.useState(false);

  const findTab = (tabName: string) =>
    props.tabs.find((t) => t.name === tabName);

  const onAdd = React.useCallback(
    (tabName: string, members: string[]) => {
      const tab = findTab(tabName);
      if (!tab) return;

      setIsSpinning(true);
      const payload = props.createAddPayload(tab.type, members);

      props
        .addMutation(payload)
        .then((response) => {
          if ("data" in response && response.data) {
            const data = response.data as {
              result?: { results?: TAddResult[] };
            };
            const results = data?.result?.results || [];

            results.forEach((result) => {
              const resultAny = result as { error?: string | null };
              if (resultAny.error !== null && resultAny.error !== undefined) {
                dispatch(
                  addAlert({
                    name: `add-${tabName}-error`,
                    title: "Error: " + resultAny.error,
                    variant: "danger",
                  })
                );
              } else {
                const extracted = tab.addResultExtractor(result);
                if (
                  containsAny(extracted.primary, members) ||
                  (extracted.external &&
                    containsAny(extracted.external, members))
                ) {
                  dispatch(
                    addAlert({
                      name: `add-${tabName}-success`,
                      title: `Added new item(s) to '${props.entityId}'`,
                      variant: "success",
                    })
                  );
                  props.onRefresh();
                }
              }
            });
          } else if ("error" in response) {
            dispatch(
              addAlert({
                name: `add-${tabName}-error`,
                title:
                  "Error: " +
                  (response.error ? String(response.error) : "Unknown error"),
                variant: "danger",
              })
            );
          }
        })
        .finally(() => {
          setIsSpinning(false);
        });
    },
    [
      props.tabs,
      props.entityId,
      props.createAddPayload,
      props.addMutation,
      props.onRefresh,
      dispatch,
    ]
  );

  const onRemove = React.useCallback(
    (tabName: string, members: string[]) => {
      const tab = findTab(tabName);
      if (!tab) return;

      setIsSpinning(true);
      const payload = props.createRemovePayload(tab.type, members);

      props
        .removeMutation(payload)
        .then((response) => {
          if ("data" in response && response.data) {
            const data = response.data as { result?: TRemoveResult };
            const result = data?.result;

            if (result) {
              const extracted = tab.removeResultExtractor(result);
              const stillContains =
                containsAny(extracted.remaining, members) ||
                (extracted.external &&
                  containsAny(extracted.external, members));

              if (!stillContains) {
                dispatch(
                  addAlert({
                    name: `remove-${tabName}-success`,
                    title: `Removed item(s) from ${props.entityId}`,
                    variant: "success",
                  })
                );
                props.onRefresh();
              } else if (
                extracted.error ||
                (extracted.failed && extracted.failed.length > 0)
              ) {
                dispatch(
                  addAlert({
                    name: `remove-${tabName}-error`,
                    title:
                      "Error: " +
                      (extracted.error || "Failed to remove some items"),
                    variant: "danger",
                  })
                );
              }
            }
          }
        })
        .finally(() => {
          setIsSpinning(false);
        });
    },
    [
      props.tabs,
      props.entityId,
      props.createRemovePayload,
      props.removeMutation,
      props.onRefresh,
      dispatch,
    ]
  );

  const onSaveAndAdd = React.useCallback(
    (tabName: string, members: string[]) => {
      const modifiedValues = props.modifiedValues();
      const categoryValue = (modifiedValues as Record<string, unknown>)[
        props.categoryFieldName
      ];

      if (categoryValue === "") {
        (modifiedValues as Record<string, unknown>).cn = props.entityId;

        props.saveMutation(modifiedValues).then((response) => {
          if ("data" in response && response.data) {
            const data = response.data as {
              result?: unknown;
              error?: ErrorResult;
            };
            if (data?.result) {
              dispatch(
                addAlert({
                  name: "save-success",
                  title: `${props.entityName} modified`,
                  variant: "success",
                })
              );
              props.onRefresh();
              onAdd(tabName, members);
            } else if (data?.error) {
              dispatch(
                addAlert({
                  name: "save-error",
                  title: data.error.message,
                  variant: "danger",
                })
              );
            }
          }
        });
      } else {
        onAdd(tabName, members);
      }
    },
    [
      props.modifiedValues,
      props.categoryFieldName,
      props.entityId,
      props.entityName,
      props.saveMutation,
      props.onRefresh,
      onAdd,
      dispatch,
    ]
  );

  return {
    isSpinning,
    onAdd,
    onRemove,
    onSaveAndAdd,
  };
}
