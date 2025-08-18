import React, {useEffect, useState} from "react";
import {Actions, ApiMetaMap, LayoutComponentDetail, runAction, layoutComponentDetailDecoder} from "xingine";
import {useParams} from "react-router-dom";
import {useActionExecutionContext} from "../../context/HierarchicalActionContext";
import {RenderComponent} from "../layout/utils/Layout.utils";
import {BadRequestPage, InternalServerErrorPage, ServiceUnavailablePage} from "./ErrorPages";

interface ComponentState {
    component: LayoutComponentDetail | null;
    isLoading: boolean;
    error: {
        type: 'api' | 'decoding' | 'network';
        message: string;
    } | null;
}

export const APIRenderer: React.FC<ApiMetaMap> = (meta)=>{
    const params = useParams();
    const ctx = useActionExecutionContext();

    const [componentState, setComponentState] = useState<ComponentState>({
        component: null,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const initialize = async () => {
            try {
                setComponentState(prev => ({ ...prev, isLoading: true, error: null }));

                const componentResult = await runAction(Actions.apiCall(meta.actionUrl,'GET',params).build(), ctx);

                if (componentResult && componentResult.success) {
                    try {
                        // Use the framework decoder to validate the result
                        const decodedComponent = layoutComponentDetailDecoder.verify(componentResult.result);

                        setComponentState({
                            component: decodedComponent,
                            isLoading: false,
                            error: null
                        });
                    } catch (decodingError) {
                        setComponentState({
                            component: null,
                            isLoading: false,
                            error: {
                                type: 'decoding',
                                message: decodingError instanceof Error ? decodingError.message : 'Invalid component format'
                            }
                        });
                    }
                } else {
                    const errorMessage = typeof componentResult?.error === 'string'
                        ? componentResult.error
                        : 'API call failed';

                    setComponentState({
                        component: null,
                        isLoading: false,
                        error: {
                            type: 'api',
                            message: errorMessage
                        }
                    });
                }

                console.warn("APIRenderer componentResult", componentResult);
            } catch (error) {
                console.error("APIRenderer initialization error:", error);
                setComponentState({
                    component: null,
                    isLoading: false,
                    error: {
                        type: 'network',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }
                });
            }
        };

        initialize();
    }, [meta.actionUrl, JSON.stringify(params)]);

    // Show loading state - framework will handle
    if (componentState.isLoading) {
        return null; // Framework will handle loading
    }

    // Show appropriate error page based on error type
    if (componentState.error) {
        switch (componentState.error.type) {
            case 'decoding':
                return <BadRequestPage customMessage={`Decoding failed: ${componentState.error.message}`} />;
            case 'api':
                return <InternalServerErrorPage customMessage={`API failed: ${componentState.error.message}`} />;
            case 'network':
                return <ServiceUnavailablePage customMessage={`Network error: ${componentState.error.message}`} />;
            default:
                return <InternalServerErrorPage customMessage={componentState.error.message} />;
        }
    }

    // Show the component by calling RenderComponent
    if (componentState.component) {
        return <RenderComponent {...componentState.component} scope={{ parent: "__", current: "api_rendered_component" }} />;
    }

    // Fallback - should not reach here, but show generic error if it does
    return <InternalServerErrorPage customMessage="No component data available" />;
}