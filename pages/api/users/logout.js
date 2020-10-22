import { withIronSession } from 'next-iron-session'
const handler = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

export default withIronSession(handler, {
    password: process.env.cookiePassword,
    cookieOptions: { secure: false },
    cookieName: process.env.cookieName,
})