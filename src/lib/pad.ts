export const pad = (n: number | string, len: number) => {
    const nString = n.toString();
    return nString.length < len ? pad(`0${n}`, len) : n;
};
