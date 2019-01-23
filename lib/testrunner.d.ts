declare module 'vscode/lib/testrunner' {
    export function configure(options: MochaSetupOptions): void;

    interface MochaSetupOptions {

        // milliseconds to wait before considering a test slow
        slow?: number;

        // enable timeouts?
        enableTimeouts?: boolean;

        // timeout in milliseconds
        timeout?: number;

        // ui name "bdd", "tdd", "exports" etc
        ui?: string;

        // array of accepted globals
        globals?: any[];

        // reporter instance (function or string), defaults to `mocha.reporters.Dot`
        reporter?: any;

        // reporter settings object
        reporterOptions?: any;

        // bail on the first test failure
        bail?: boolean;

        // ignore global leaks
        ignoreLeaks?: boolean;

        // grep string or regexp to filter tests with
        grep?: any;

        // colored output from test results
        useColors?: boolean;

        // causes test marked with only to fail the suite
        forbidOnly?: boolean;

        // pending tests and tests marked skip fail the suite
        forbidPending?: boolean;

        // number of times to retry failed tests
        retries?: number;

        // display the full stack-trace on failing
        fullStackTrace?: boolean;

        // delay root suite execution
        delay?: boolean;

        // use inline diffs rather than +/-
        useInlineDiffs?: boolean;
    }
}
