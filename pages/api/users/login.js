import { query } from '../../../lib/db'
import { withIronSession } from 'next-iron-session'
export const config = {
    api: {
        externalResolver: true,
    },
}

const handler = async (req, res) => {
    const { username, password, remember } = JSON.parse(req.body)
    const qry = `select * from users where username = '${username}' and password = '${password}'`
    const result = await query(qry).catch(err => {
        res.json({ success: false, message: err.message })
    })
    if (result) {
        console.log(result)
        req.session.set('user', result[0])
        await req.session.save();
        res.json({ success: true, message: 'Login Berhasil' })

    } else {
        res.json({ success: false, message: 'Username dan Password salah !' })
    }
}


export default withIronSession(handler, {
    password: process.env.cookiePassword,
    cookieOptions: { secure: false },
    cookieName: process.env.cookieName,
})