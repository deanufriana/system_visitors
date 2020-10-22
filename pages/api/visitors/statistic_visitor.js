import { query } from '../../../lib/db'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = await query(`select DATE_FORMAT(visit_date, '%d-%m-%Y') as visit_date, count(*) as 'total' from visitors.visitors where visit_date > now() group by visit_date order by visit_date limit 5`)
        res.json({ success: true, resdata: data })
    } else {
        res.end('404 Not Found')
    }
}