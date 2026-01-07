/**
 * Template renderer utility
 *
 * Renders prompt templates by substituting variables with values
 */

/**
 * Render template with variables
 *
 * Substitutes ${variable} placeholders with values from the variables object.
 * Empty or undefined variables are replaced with empty strings.
 *
 * @param template Template string with ${variable} placeholders
 * @param variables Object mapping variable names to values
 * @returns Rendered template string
 *
 * @example
 * ```typescript
 * const template = `# Title\n${content}\n\n${optionalSection}`;
 *
 * const result = renderTemplate(template, {
 *     content: 'Hello World',
 *     optionalSection: '# Optional\nSome data'
 * });
 * // Result: "# Title\nHello World\n\n# Optional\nSome data\n"
 * ```
 */
export function renderTemplate(template: string, variables: Record<string, string | undefined>): string {
    let output = template

    // Replace each variable placeholder with its value
    for (const [key, value] of Object.entries(variables)) {
        const replacement = (value ?? "").trim()
        output = output.replace(new RegExp(`\\$\\{${key}\\}`, "g"), replacement)
    }

    // Collapse excessive blank lines (3+ consecutive newlines)
    output = output.replace(/\n{3,}/g, "\n\n").trim()

    // Ensure ends with single newline
    if (!output.endsWith("\n")) {
        output += "\n"
    }

    return output
}
