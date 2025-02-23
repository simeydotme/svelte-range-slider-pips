import { SvelteComponent } from "svelte";
import { type SpringOpts } from 'svelte/motion';
import type { Pip, Formatter } from '../types.js';
declare const __propDef: {
    props: {
        slider?: HTMLDivElement | undefined;
        range?: boolean | "min" | "max" | undefined;
        pushy?: boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        values?: number[] | undefined;
        value?: number | undefined;
        vertical?: boolean | undefined;
        float?: boolean | undefined;
        reversed?: boolean | undefined;
        hoverable?: boolean | undefined;
        disabled?: boolean | undefined;
        limits?: [number, number] | null | undefined;
        pips?: boolean | undefined;
        pipstep?: number | undefined;
        all?: Pip;
        first?: Pip;
        last?: Pip;
        rest?: Pip;
        id?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        formatter?: Formatter | undefined;
        handleFormatter?: Formatter | undefined;
        ariaLabels?: string[] | undefined;
        precision?: number | undefined;
        springValues?: SpringOpts | undefined;
    };
    events: {
        start: CustomEvent<any>;
        stop: CustomEvent<any>;
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RangeSliderProps = typeof __propDef.props;
export type RangeSliderEvents = typeof __propDef.events;
export type RangeSliderSlots = typeof __propDef.slots;
export default class RangeSlider extends SvelteComponent<RangeSliderProps, RangeSliderEvents, RangeSliderSlots> {
}
export {};
