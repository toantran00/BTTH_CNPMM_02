const db = require('../config/db')

const getIdentifierOrThrow = (value, envName) => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
        throw new Error(`Invalid SQL identifier in ${envName}`)
    }
    return value
}

const getAuthUserConfig = () => ({
    table: getIdentifierOrThrow(process.env.AUTH_USER_TABLE || 'users', 'AUTH_USER_TABLE'),
    idColumn: getIdentifierOrThrow(process.env.AUTH_USER_ID_COLUMN || 'id', 'AUTH_USER_ID_COLUMN'),
    nameColumn: getIdentifierOrThrow(
        process.env.AUTH_USER_NAME_COLUMN || 'username',
        'AUTH_USER_NAME_COLUMN'
    ),
    emailColumn: getIdentifierOrThrow(
        process.env.AUTH_USER_EMAIL_COLUMN || 'email',
        'AUTH_USER_EMAIL_COLUMN'
    ),
    passwordColumn: getIdentifierOrThrow(
        process.env.AUTH_USER_PASSWORD_COLUMN || 'password',
        'AUTH_USER_PASSWORD_COLUMN'
    ),
    roleColumn: getIdentifierOrThrow(
        process.env.AUTH_USER_ROLE_COLUMN || 'role',
        'AUTH_USER_ROLE_COLUMN'
    ),
    activeColumn: getIdentifierOrThrow(
        process.env.AUTH_USER_ACTIVE_COLUMN || 'is_active',
        'AUTH_USER_ACTIVE_COLUMN'
    )
})

const findUserByEmail = async (email) => {
    const config = getAuthUserConfig()
    const query = `
        SELECT
            \`${config.idColumn}\` AS id,
            \`${config.nameColumn}\` AS name,
            \`${config.emailColumn}\` AS email,
            \`${config.passwordColumn}\` AS passwordHash,
            \`${config.roleColumn}\` AS role,
            \`${config.activeColumn}\` AS isActive
        FROM \`${config.table}\`
        WHERE \`${config.emailColumn}\` = ?
        LIMIT 1
    `

    const [rows] = await db.execute(query, [email])
    return rows[0] || null
}

module.exports = {
    findUserByEmail
}
