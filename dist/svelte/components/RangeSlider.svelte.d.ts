import { SvelteComponent } from "svelte";
import { type SpringOpts } from 'svelte/motion';
import type { Pip, Formatter } from '../types.js';
declare const __propDef: {
    props: {
        slider?: HTMLDivElement | undefined;
        range?: boolean | "min" | "max";
        pushy?: boolean;
        min?: number;
        max?: number;
        step?: number;
        values?: number[];
        value?: number;
        vertical?: boolean;
        float?: boolean;
        reversed?: boolean;
        hoverable?: boolean;
        disabled?: boolean;
        limits?: null | [number, number];
        pips?: boolean;
        pipstep?: number | undefined;
        all?: Pip;
        first?: Pip;
        last?: Pip;
        rest?: Pip;
        id?: string | undefined;
        prefix?: string;
        suffix?: string;
        formatter?: Formatter;
        handleFormatter?: Formatter;
        ariaLabels?: string[];
        precision?: number;
        springValues?: SpringOpts;
    };
    events: {
        start: CustomEvent<any>;
        stop: CustomEvent<any>;
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type RangeSliderProps = typeof __propDef.props;
export type RangeSliderEvents = typeof __propDef.events;
export type RangeSliderSlots = typeof __propDef.slots;
export default class RangeSlider extends SvelteComponent<RangeSliderProps, RangeSliderEvents, RangeSliderSlots> {
}
export {};
