import { query } from '../../../lib/db'

export default async function handler(req, res) {
    const { id } = JSON.parse(req.body)
    const data = await query(`call attend_visitor (${id})`).catch(err => {
        res.json({ success: false, message: 'There any error' })
        return
    })
    res.json({ success: data.error ? false : true, message: data.error ? data.error.sqlMessage : 'Attend was validate' })
}