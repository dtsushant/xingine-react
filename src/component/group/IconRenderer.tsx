import {IconMeta} from "xingine";
import * as AntIcons from '@ant-design/icons';
import {QuestionCircleOutlined} from "@ant-design/icons";

export const IconRenderer = (props: IconMeta) => {
    const {
        name,
        color,
        size,
        spin,
        rotate,
        twoToneColor,
        className,
    } = props;

    const IconComponent = (AntIcons as Record<string, any>)[name ?? ''];

    if (!IconComponent) {
        return <QuestionCircleOutlined style={{ fontSize: size, color }} className={className} />;
    }

    return (
        <IconComponent
            spin={spin}
            rotate={rotate}
            twoToneColor={twoToneColor}
            className={className}
            style={{
                fontSize: typeof size === 'number' ? `${size}px` : size,
                color,
            }}
        />
    );
};