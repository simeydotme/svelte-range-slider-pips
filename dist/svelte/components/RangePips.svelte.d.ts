import { SvelteComponent } from "svelte";
import type { Pip, Formatter } from '../types.js';
declare const __propDef: {
    props: {
        range?: boolean | "min" | "max" | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        value?: number | undefined;
        values?: number[] | undefined;
        vertical?: boolean | undefined;
        reversed?: boolean | undefined;
        hoverable?: boolean | undefined;
        disabled?: boolean | undefined;
        limits?: [number, number] | null | undefined;
        pipstep?: number | undefined;
        all?: Pip;
        first?: Pip;
        last?: Pip;
        rest?: Pip;
        prefix?: string | undefined;
        suffix?: string | undefined;
        formatter?: Formatter | undefined;
        precision?: number | undefined;
        focus: boolean;
        orientationStart: 'left' | 'right' | 'top' | 'bottom';
        moveHandle: (index: number | null, value: number) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RangePipsProps = typeof __propDef.props;
export type RangePipsEvents = typeof __propDef.events;
export type RangePipsSlots = typeof __propDef.slots;
export default class RangePips extends SvelteComponent<RangePipsProps, RangePipsEvents, RangePipsSlots> {
}
export {};
