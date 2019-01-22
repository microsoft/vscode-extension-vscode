
import { MochaOptions } from 'mocha';

declare module 'vscode/lib/testrunner' {
    export function configure(options: MochaSetupOptions): void;

    interface MochaSetupOptions extends MochaOptions {
    }
}
