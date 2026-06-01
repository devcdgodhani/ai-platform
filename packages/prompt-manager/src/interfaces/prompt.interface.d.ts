export interface PromptTemplate {
    name: string;
    version: string;
    description: string;
    system: string;
    userTemplate: string;
    variables: string[];
}
export interface CompiledPrompt {
    system: string;
    user: string;
}
//# sourceMappingURL=prompt.interface.d.ts.map