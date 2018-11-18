const lockedPaguesForGuest = [
    '/transactions',
    '/view/transactions'
]
const lockedPagesForUser = [
    '/',
    '/login',
    '/register',
]

function requestUrl() {
    return process.env.LINK;
}


export {lockedPaguesForGuest, lockedPagesForUser, requestUrl}