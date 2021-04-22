import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { WidgetStateSave } from "@app-types";
import { WIDGET_SAVE_STATE_CHANNEL } from "@constants";
import useChannel from "@hooks/useChannel";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetProps {
  alias: string;
  id: string;
  initialState: string;
}

const Widget: React.FC<WidgetProps> = ({ alias, initialState, id }) => {
  const widgetStateSaveChannel = useChannel<WidgetStateSave>(WIDGET_SAVE_STATE_CHANNEL);
  const element = useRef();

  useEffect(() => {
    let shadow;

    if (element && element.current) {
      // @ts-ignore
      shadow = element.current.attachShadow({ mode: "closed" });

      if (!alias) {
        shadow.innerText = `Alias not defined`;
      } else if (!window.widgetRegistry.hasAlias(alias)) {
        shadow.innerText = `Alias not registered: ${alias}`;
      } else {
        window.widgetRegistry.load(alias, {
          element: shadow,
          initialState,
          onStateChange: (state) => widgetStateSaveChannel.dispatch({ id, state }),
        });
      }
    } else {
      console.warn("what?");
    }

    return () => {
      if (shadow) window.widgetRegistry.unload(alias, shadow);
    };
  }, [alias]);

  return <AbsoluteWrapper top={0} left={0} width={100} height={100} ref={element} />;
};

Widget.propTypes = {
  alias: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  initialState: PropTypes.string.isRequired,
};

export default Widget;
