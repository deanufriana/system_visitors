import { query } from '../../../lib/db'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { from, until } = JSON.parse(req.body)
        const data = await query(`select id, attend, DATE_FORMAT(visit_date, '%W, %d-%m-%Y') as visit_date, DATE_FORMAT(register_date, '%d-%m-%Y %H:%i:%s') as register_date, name, gender, email, phone from visitors where visit_date BETWEEN '${from}' AND '${until}'`).catch(err => {
            res.json({ success: false, resdata: [], err: err.sqlMessage })
        })
        res.json({ success: true, resdata: data })
    } else {
        res.end('404 Not Found')
    }
}