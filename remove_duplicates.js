const fs = require('fs');

if(!fs.existsSync('./users.json'))
    fs.writeFileSync('./users.json', '[]')

let users = JSON.parse(fs.readFileSync('./users.json'))
let newUsers = []

for(const user of users) {
    if(newUsers.find((x) => x.id === user.id))
        continue
    newUsers.push(user)
}

fs.writeFileSync('new_users.json', JSON.stringify(newUsers, undefined, 2))
console.log('done')