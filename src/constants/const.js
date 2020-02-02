const lockedPagesForGuestRegex = [
    /transactions/g,
    /transactions\/[0-9]{4}\/[0-9]{2}/g,
    /statistics/g
]
const lockedPagesForUserRegex = [
    /login/g,
    /register/g,
]

function requestUrl() {
    return process.env.LINK;
}


export { lockedPagesForGuestRegex, lockedPagesForUserRegex, requestUrl }
