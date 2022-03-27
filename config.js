import "dotenv/config"

export default {
    HTTP_PORT:process.env.SERVER_PORT,
    DB_FILE:process.env.DBSOURCE,
}
