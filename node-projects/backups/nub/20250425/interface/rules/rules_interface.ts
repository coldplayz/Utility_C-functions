export interface isRulesInterface {
    id: string
    errorMessage: string
    validator: (value: any) => boolean;
}