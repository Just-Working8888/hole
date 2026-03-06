import { FC, HTMLAttributes } from 'react';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

import styles from './Skeleton.module.scss'; // SCSS

export const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={`${styles.skeleton} ${className || ''}`}
            {...props}
        />
    );
};
