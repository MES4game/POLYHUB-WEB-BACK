export function isValidPassword(password: string): boolean {
    return (/^[\w!#%*+/_~-]{12,64}$/).test(password);
}

export function isValidUser(user: string): boolean {
    return user.length > 3 && user.length < 65 && (/^(?:[\w!#$%&'*+/=?^_`{|}~-]+\.)*[\w!#$%&'*+/=?^_`{|}~-]+$/).test(user);
}

export function isValidDomain(domain: string): boolean {
    return (/^(?:(?:[a-z0-9][a-z0-9-]{0,61})?[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/).test(domain);
}

export function isValidEmail(email: string): boolean {
    const index = email.indexOf("@");
    if (index === -1) return false;

    return isValidUser(email.slice(0, index)) && isValidDomain(email.slice(index + 1));
}
