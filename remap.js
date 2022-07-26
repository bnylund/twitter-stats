const fs = require('fs');

// Loop through all JSON files under tweets/, and display a prompt to select a game/group for each user
const files = fs.readdirSync('./tweets', { withFileTypes: true }).filter((x => x.name.endsWith('.json')))

// Initialize to empty user list
if(!fs.existsSync('./users.json'))
    fs.writeFileSync('./users.json', '[]')

let users = JSON.parse(fs.readFileSync('./users.json'))

//for(const file of files) {
//    try{
//        const data = JSON.parse(fs.readFileSync(`./tweets/${file.name}`))
//
//        for(const user of [...data.likes, ...data.retweets]) {
//            if(users.find((x) => x.id === user.id))
//                continue
//
//            console.log(`Adding ${user.name}`)
//            users.push(user)
//        }
//    } catch(err) {
//        console.log(`Error in file ${file.name}, skipping.`)
//        console.log(err.message)
//    }
//}
//
console.log(`${users.length} users`)
fs.writeFileSync('./users.json', JSON.stringify(users, undefined, 2))

var stdin = process.stdin;
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

const char_map = {
    'r': "ROCKET_LEAGUE",
    'c': "ESPORTS_CLUB",
    'u': "UNKNOWN"
}

const getChar = async () => {
    return new Promise((resolve, reject) => {
        stdin.once('data', (key) => {
            if(key === '\u0003') {
                reject()
            }
            resolve(key.toString())
        })
    })
}

const main = async () => {
    let i = 1

    // Prompt for grouping
    for(const user of users) {
        if(!user) continue
        if(user.group && user.group.length > 0) {
            i++
            continue
        }

        console.log(user)

        while(true) {
            console.log(`[${i} / ${users.length}] ${user.name} @${user.username} [https://twitter.com/${user.username}] ${user.group ? `[Group: ${user.group}]` : ''}`)
            console.log('r - ROCKET_LEAGUE, c - ESPORTS_CLUB, u - UNKNOWN')
    
            const group = await getChar()
            if(char_map[group]) {
                console.log(`Group set to ${char_map[group]}`)
                user.group = char_map[group]
                break
            }

            console.log('Invalid group.')
        }
        i++
    }
    
    fs.writeFileSync('./users.json', JSON.stringify(users, undefined, 2))
    console.log('Done!')
    process.exit(0)
}

main()
