import React from "react";
import { Commissar } from "xingine";
import {initComponentDetailWithScope, RenderComponent} from "./utils/Layout.utils";
import { useGlobalState, useContentState } from "../../context/HierarchicalActionContext";

export const DefaultContentRenderer: React.FC<Commissar> = (commissar) => {
  const globalState = useGlobalState();
  const contentState = useContentState();

  return (
    <div>
        <div style={{marginTop: '40px', marginLeft: '170px', padding: '10px', border: '1px solid #ccc'}}>
            <h3>Global State:</h3>
            <pre style={{backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto'}}>
          {JSON.stringify(globalState.state, null, 2)}
        </pre>

            <h3>Content State:</h3>
            <pre style={{backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto'}}>
          {JSON.stringify(contentState.state, null, 2)}
        </pre>
        </div>

        <RenderComponent {...initComponentDetailWithScope(commissar, 'content')} />
    </div>
  );
};

export default DefaultContentRenderer;
