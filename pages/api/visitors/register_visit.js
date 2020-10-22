import { query } from '../../../lib/db'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, visit_date, gender, phone, email } = JSON.parse(req.body)
        console.log(req.body)
        const data = await query(`call ADD_VISITORS ('${name}', '${visit_date}', '${gender}', '${phone}', '${email}')`)
            .catch(err => {
                res.json({ success: false, message: err.message })
                return
            })
        res.json({ success: data.error ? false : true, message: data.error ? data.error.sqlMessage : "registration was successful", extra: { lastID: data.error ? '' : data[0][0].lastID } })
    } else {
        res.end('404 Not Found')
    }
}