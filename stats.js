const fs = require('fs');

// Loop through all JSON files under tweets/, and display a prompt to select a game/group for each user
const files = fs.readdirSync('./tweets', { withFileTypes: true }).filter((x => x.name.endsWith('.json')))

// Initialize to empty user list
if (!fs.existsSync('./users.json'))
    fs.writeFileSync('./users.json', '[]')

let users = JSON.parse(fs.readFileSync('./users.json'))

let likes = {
    rl: 0,
    club: 0,
    other: 0
}

let retweets = {
    rl: 0,
    club: 0,
    other: 0
}

console.log(`${users.length} unique users`)

for (const file of files) {
    try {
        const data = JSON.parse(fs.readFileSync(`./tweets/${file.name}`))

        for (const likeUser of data.likes) {
            if (users.find((x) => x.id === likeUser.id)) {
                const user = users.find((x) => x.id === likeUser.id)
                if (user.group === 'ROCKET_LEAGUE') {
                    likes.rl += 1
                } else if (user.group === 'ESPORTS_CLUB') {
                    likes.club += 1
                } else {
                    likes.other += 1
                }
            }
        }

        for (let rt of data.retweets) {
            let user = users.find((x) => x.id === rt.id)
            if (user) {
                //console.log(user)
                if (user.group === 'ROCKET_LEAGUE') {
                    retweets.rl += 1
                } else if (user.group === 'ESPORTS_CLUB') {
                    retweets.club += 1
                } else {
                    retweets.other += 1
                }
            }
        }
    } catch (err) {
        console.log(`Error in file ${file.name}, skipping.`)
        console.log(err.message)
    }
}

console.log('--- LIKES ---\n')
console.log(`ROCKET_LEAGUE: ${((likes.rl / (likes.rl + likes.other + likes.club)) * 100).toFixed(2)}%`)
console.log(`ESPORTS_CLUB: ${((likes.club / (likes.rl + likes.other + likes.club)) * 100).toFixed(2)}%`)
console.log(`OTHER: ${((likes.other / (likes.rl + likes.other + likes.club)) * 100).toFixed(2)}%\n`)
console.log(`TOTAL LIKES: ${likes.club + likes.other + likes.rl}\n`)

console.log('--- RETWEETS ---\n')
console.log(`ROCKET_LEAGUE: ${((retweets.rl / (retweets.rl + retweets.club + retweets.other)) * 100).toFixed(2)}%`)
console.log(`ESPORTS_CLUB: ${((retweets.club / (retweets.rl + retweets.club + retweets.other)) * 100).toFixed(2)}%`)
console.log(`OTHER: ${((retweets.other / (retweets.rl + retweets.club + retweets.other)) * 100).toFixed(2)}%\n`)
console.log(`TOTAL RETWEETS: ${retweets.club + retweets.other + retweets.rl}\n`)