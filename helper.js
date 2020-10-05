const users = [];

const currentUser = (id) => {
    return users.find(user => user.id === id)
}

const userJoin = (id, username ) => {
    const user = {id, username }
    users.push(user);
    return user
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

module.exports = { currentUser, userJoin, userLeave }