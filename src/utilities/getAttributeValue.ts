export function getAttributeValue(attributeValidated: RegExpMatchArray | null): string | null {
    if (!attributeValidated) {
        return null;
    }
    const value = attributeValidated[0].split("=")[1];
    const valueWithoutQuotes = value.replace(/"/g, "");
    if (valueWithoutQuotes === '') {
        return null;
    }
    return valueWithoutQuotes;
}