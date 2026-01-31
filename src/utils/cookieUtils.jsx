// cookieUtils.js

// ✅ Set cookie
// cookieUtils.js - Add Secure flag for production
export const setCookie = (name, value, days = 7) => {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; ${secureFlag}`
}


// ✅ Get cookie
export const getCookie = (name) => {
    const nameEQ = name + "="
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim()
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length)
        }
    }
    return null
}

// ✅ Delete cookie
export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// ✅ Clear all cookies
export const clearAllCookies = () => {
    document.cookie.split(";").forEach((c) => {
        const cookieName = c.split("=")[0].trim()
        deleteCookie(cookieName)
    })
}
