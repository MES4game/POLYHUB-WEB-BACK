export function isValidPassword(password: string): boolean {
    return (/^[\w!#%*+/_~-]{12,64}$/).test(password);
}

export function isValidPseudo(pseudo: string): boolean {
    return pseudo.length > 3 && pseudo.length < 65 && (/^(?:[\w!#$%&'*+/=?^_`{|}~-]+\.)*[\w!#$%&'*+/=?^_`{|}~-]+$/).test(pseudo);
}

export function isValidDomain(domain: string): boolean {
    return (/^(?:(?:[a-z0-9][a-z0-9-]{0,61})?[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/).test(domain);
}

export function isValidEmail(email: string): boolean {
    if (email.length > 512) return false;

    const index = email.indexOf("@");
    if (index === -1) return false;

    return isValidPseudo(email.slice(0, index)) && isValidDomain(email.slice(index + 1));
}
