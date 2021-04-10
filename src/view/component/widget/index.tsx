import React, {useEffect, useRef} from "react";
import styled from "styled-components";

interface WidgetProps {
  alias: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const WidgetContentWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

interface WidgetContentProps {
  alias: string;
}

const WidgetContent: React.FC<WidgetContentProps> = ({ alias }) => {
  const element = useRef();

  useEffect(() => {
    let shadow;

    if (element && element.current) {
      // @ts-ignore
      const shadow = element.current.attachShadow({ mode: 'closed' });

      if (!alias) {
        shadow.innerText = `Alias not defined`;
      } else if (!window.widgetRegistry.hasAlias(alias)) {
        shadow.innerText = `Alias not registered: ${alias}`;
      } else  {
        window.widgetRegistry.load(alias, shadow); //
      }
    } else {
      console.warn('what?')
    }

    return () => {
      if (shadow) window.widgetRegistry.unload(alias, shadow);
    };
  }, [alias]);

  return (
    <WidgetContentWrapper ref={element}/>
  );
}

const Widget: React.FC<WidgetProps> = ({ alias, ...bounds }) => {
  return (
    <WidgetContent alias={alias}/>
  );
}

export default Widget;
