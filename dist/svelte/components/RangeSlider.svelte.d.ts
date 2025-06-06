import { SvelteComponent } from "svelte";
import { type SpringOpts } from 'svelte/motion';
import type { Pip, Formatter, RangeFormatter } from '../types.js';
declare const __propDef: {
    props: {
        slider?: HTMLDivElement | undefined;
        precision?: number | undefined;
        range?: boolean | "min" | "max" | undefined;
        pushy?: boolean | undefined;
        draggy?: boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        values?: number[] | undefined;
        value?: number | undefined;
        vertical?: boolean | undefined;
        float?: boolean | undefined;
        rangeFloat?: boolean | undefined;
        reversed?: boolean | undefined;
        hoverable?: boolean | undefined;
        disabled?: boolean | undefined;
        limits?: [number, number] | null | undefined;
        rangeGapMin?: number | undefined;
        rangeGapMax?: number | undefined;
        pips?: boolean | undefined;
        pipstep?: number | undefined;
        all?: Pip;
        first?: Pip;
        last?: Pip;
        rest?: Pip;
        prefix?: string | undefined;
        suffix?: string | undefined;
        formatter?: Formatter | undefined;
        handleFormatter?: Formatter | undefined;
        rangeFormatter?: RangeFormatter | null | undefined;
        ariaLabels?: string[] | undefined;
        id?: string | undefined;
        class?: string | undefined;
        style?: string | undefined;
        darkmode?: false | "auto" | "force" | undefined;
        springValues?: SpringOpts | undefined;
        spring?: boolean | undefined;
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
