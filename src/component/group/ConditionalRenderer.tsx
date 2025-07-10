import React, {useEffect, useMemo, useState} from "react";
import {ConditionalMeta, evaluateCondition} from "xingine";
import {usePanelControlContext} from "../../context/XingineContextBureau";
import {getAllComponentMap} from "../utils/Component.utils";


interface ConditionalMetaExtended extends ConditionalMeta {
    scope?:Record<string, unknown>
}
export const ConditionalRenderer: React.FC<ConditionalMetaExtended> = (meta) => {

    const compMap = getAllComponentMap();
    const {headerActionContext} = usePanelControlContext();
    const {condition, trueComponent, falseComponent, scope} = meta;
    const [predicate, setPredicate] = useState(false);

    /*
    TODO:- this should refresh the component only for current matching condition not for all the component with condtion
    const conditionValue = useMemo(() => {
        const source = scope?.hasOwnProperty(condition.field)
            ? scope
            : headerActionContext;
        return source[condition.field];
    }, [condition.field, scope[condition.field], headerActionContext[condition.field]]);*/

    /*const combinedScope = {headerActionContext, ...scope};
    const predicate = evaluateCondition(condition, combinedScope);*/
    useEffect(() => {
        const result = evaluateCondition(condition, {...headerActionContext, ...scope });
        setPredicate(result);
    }, [headerActionContext, scope, condition]);

    const Component = predicate
        ? (trueComponent.meta?.component && compMap[trueComponent.meta.component])
        : (falseComponent?.meta?.component && compMap[falseComponent.meta.component]);

    const props = predicate
        ? trueComponent.meta?.properties
        : falseComponent?.meta?.properties;

    return (Component && <Component {...props}/>);

}

