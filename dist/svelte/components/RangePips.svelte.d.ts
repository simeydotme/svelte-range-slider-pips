import { SvelteComponent } from "svelte";
import type { Pip, Formatter } from '../types.js';
declare const __propDef: {
    props: {
        range?: boolean | "min" | "max";
        min?: number;
        max?: number;
        step?: number;
        value?: number;
        values?: number[];
        vertical?: boolean;
        reversed?: boolean;
        hoverable?: boolean;
        disabled?: boolean;
        pipstep?: number | undefined;
        all?: Pip;
        first?: Pip;
        last?: Pip;
        rest?: Pip;
        prefix?: string;
        suffix?: string;
        formatter?: Formatter;
        precision?: number;
        focus: boolean;
        orientationStart: "left" | "right" | "top" | "bottom";
        moveHandle: (index: number | null, value: number) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type RangePipsProps = typeof __propDef.props;
export type RangePipsEvents = typeof __propDef.events;
export type RangePipsSlots = typeof __propDef.slots;
export default class RangePips extends SvelteComponent<RangePipsProps, RangePipsEvents, RangePipsSlots> {
}
export {};
