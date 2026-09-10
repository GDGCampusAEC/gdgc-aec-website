import * as React from "react";
import styles from "./gemini-border-button.module.css";

type GeminiBorderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export function GeminiBorderButton({ children, className = "", ...props }: GeminiBorderButtonProps) {
    return (
        <button
            type="button" className={`${styles.button} ${className}`} {...props}>
            <span>{children}</span>
        </button>
    );
}
