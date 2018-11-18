const lockedPaguesForGuest = [
    '/transactions',
    '/view/transactions'
]
const lockedPagesForUser = [
    '/',
    '/login',
    '/register',
]
const API_ENDPOINT = {
    production: 'https://wukshas-monthly-spendings-back.herokuapp.com/api',
    dev: 'http://localhost:8000/api'
}

function requestUrl() {
    return process.env.LINK;
}


export {lockedPaguesForGuest, lockedPagesForUser, requestUrl}