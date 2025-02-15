import { Tensor } from '../tensor';
export declare class Ops {
    static logSumExp<T extends Tensor>(input: Tensor, axis?: number | number[], keepDims?: boolean): T;
    static sum<T extends Tensor>(x: Tensor, axis?: number | number[], keepDims?: boolean): T;
    static mean<T extends Tensor>(x: Tensor, axis?: number | number[], keepDims?: boolean): T;
    static min<T extends Tensor>(x: Tensor, axis?: number | number[], keepDims?: boolean): T;
    static max<T extends Tensor>(x: Tensor, axis?: number | number[], keepDims?: boolean): T;
    static argMin<T extends Tensor>(x: Tensor, axis?: number): T;
    static argMax<T extends Tensor>(x: Tensor, axis?: number): T;
    static moments(x: Tensor, axis?: number | number[], keepDims?: boolean): {
        mean: Tensor;
        variance: Tensor;
    };
}
