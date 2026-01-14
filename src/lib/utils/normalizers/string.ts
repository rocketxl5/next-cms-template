export function normalizeString(value: unknown): string {
    if(typeof value !== 'string') {
        return '';
    }

    return value.trim();
}

export function normalizeLowerCase(value: unknown): string {
    return normalizeString(value).toLocaleLowerCase();
}

export function normalizeUpperCase(value: unknown): string {
    return normalizeString(value).toLocaleUpperCase();
}

export function normalizeNullableString(
    value: unknown
): string | null {

    if(value === null) {
        return null;
    }

    return normalizeString(value);
}