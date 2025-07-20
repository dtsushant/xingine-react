import React from 'react';
import { ActionProvider } from '../../context/ActionContextBureau';
import { DefaultLayoutRenderer } from './DefaultLayoutRenderer';
import { LayoutRenderer } from 'xingine';

export const LayoutWithActionProvider: React.FC<LayoutRenderer> = (props) => {
    return (
        <ActionProvider>
            <DefaultLayoutRenderer {...props} />
        </ActionProvider>
    );
};

export default LayoutWithActionProvider;
