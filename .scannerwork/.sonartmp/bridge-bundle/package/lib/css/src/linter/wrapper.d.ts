import stylelint from 'stylelint';
/**
 * A wrapper of Stylelint linter
 */
export declare class LinterWrapper {
    /**
     * Lints a stylesheet
     *
     * Linting a stylesheet implies using Stylelint linting functionality to find
     * problems in the sheet. It does not need to be provided with an abstract
     * syntax tree as Stylelint takes care of the parsing internally.
     *
     * The result of linting a stylesheet requires post-linting transformations
     * to return SonarQube issues. These transformations essentially consist in
     * transforming Stylelint results into SonarQube issues.
     *
     * Because stylesheets are far different from what a source code is, metrics
     * computation does not make sense when analyzing such file contents. Issues
     * only are returned after linting.
     *
     * @param filePath the path of the stylesheet
     * @param options the linting options
     * @returns the found issues
     */
    lint(filePath: string, options: stylelint.LinterOptions): Promise<{
        issues: import("./issues").Issue[];
    }>;
}
/**
 * The global Stylelint linter wrapper
 */
export declare const linter: LinterWrapper;
