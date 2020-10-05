const users = [];

const currentUser = (id) => {
    return users.find(user => user.id === id)
}

const userJoin = (id, username ) => {
    const user = {id, username }
    users.push(user);
    return user
}

module.exports = { currentUser, userJoin }