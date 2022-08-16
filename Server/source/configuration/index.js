const env = require('dotenv')
const result = env.config()
if (result.error) {
    throw result.error
}
module.exports = {
    API_PORT: result.parsed.PORT,
    URL_PATTERN: result.parsed.URL_PATTERN,
    JWT_SUB: result.parsed.JWT_SUB,
    JWT_ISS: result.parsed.JWT_ISS,
    JWT_AUD: result.parsed.JWT_AUD,
    JWT_ALGO: result.parsed.JWT_ALGO,
    JWT_EXPIRE_IN: result.parsed.JWT_EXPIRE_IN,
    DB: result.parsed.DB_CONNECTION_STRING,
    DOC_PATH: result.parsed.DOC_PATH,
}
