import mysql from 'serverless-mysql'

const db = mysql({
    config: {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
    }
})


export const query = async (query) => {
    try {
        const results = await db.query(query)
        await db.end()
        return results
    } catch (error) {
        return { error }
    }
}