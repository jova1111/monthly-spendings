const lockedPaguesForGuest = [
    '/transactions',
    '/view/transactions'
]
const lockedPagesForUser = [
    '/',
    '/login',
    '/register',
]
const requestUrl = [
    //'https://wukshas-monthly-spendings-back.herokuapp.com/api'
    'http://localhost:8000/api'
]

export {lockedPaguesForGuest, lockedPagesForUser, requestUrl}