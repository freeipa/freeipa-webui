import { useEffect } from "react";
import { useAppDispatch } from "src/store/hooks";
import {
  setHelpTopic,
  closeHelpPanel,
} from "src/store/Global/contextual-help-slice";

/**
 * Sets the contextual help topic on mount and clears it on unmount.
 * Pages still dispatch `toggleHelpPanel()` directly on their Help button click.
 */
const useContextualHelpTopic = (topic: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHelpTopic(topic));
    return () => {
      dispatch(setHelpTopic(""));
      dispatch(closeHelpPanel());
    };
  }, [dispatch, topic]);
};

export default useContextualHelpTopic;
