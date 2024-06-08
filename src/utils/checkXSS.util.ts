async function checkXSS(str: any) {
    if (!str) return false;
    const res = `${str}`.replace(/[&<>"'/`;=]/g, ' ').replace('script', ' ');
    return res;
}

export default checkXSS;