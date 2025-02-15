import { GPGPUProgram } from './gpgpu_math';
export declare class ConcatProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(aShape: number[], bShape: number[], axis: number);
}
