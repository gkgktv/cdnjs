import { NamedArrayMap } from '../../../util';
import { Array2D } from '../../ndarray';
import { KernelInputConfig, KernelNode, TapeNodeInputGradientArrays } from '../tape_types';
export interface MultinomialNode extends KernelNode {
    inputAndArgs: MultinomialInputConfig;
    output: Array2D<'int32'>;
    gradient: (dy: Array2D<'int32'>, y: Array2D<'int32'>) => MultinomialGradientInputArrays;
}
export interface MultinomialInputConfig extends KernelInputConfig {
    inputs: MultinomialInputArrays;
    args: {
        numSamples: number;
        seed: number;
    };
}
export interface MultinomialInputArrays extends NamedArrayMap {
    probs: Array2D;
}
export interface MultinomialGradientInputArrays extends TapeNodeInputGradientArrays {
    probs: () => Array2D;
}
