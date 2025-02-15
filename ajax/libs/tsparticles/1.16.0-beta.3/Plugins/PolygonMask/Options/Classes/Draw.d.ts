import type { IDraw } from "../Interfaces/IDraw";
import { DrawStroke } from "./DrawStroke";
import type { RecursivePartial } from "../../../../Types/RecursivePartial";
import { OptionsColor } from "../../../../Options/Classes/OptionsColor";
export declare class Draw implements IDraw {
    get lineWidth(): number;
    set lineWidth(value: number);
    get lineColor(): string | OptionsColor;
    set lineColor(value: string | OptionsColor);
    enable: boolean;
    stroke: DrawStroke;
    constructor();
    load(data?: RecursivePartial<IDraw>): void;
}
