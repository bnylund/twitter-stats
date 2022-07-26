const fs = require('fs');

// Loop through all JSON files under tweets/, and display a prompt to select a game/group for each user
const files = fs.readdirSync('./tweets', { withFileTypes: true }).filter((x => x.name.endsWith('.json')))

for(const file of files) {
    try{
        const data = JSON.parse(fs.readFileSync(`./tweets/${file.name}`))

        data.retweets = data.retweets[0]
        data.quotes = data.quotes[0]

        fs.writeFileSync(`./tweets/${file.name}`, JSON.stringify(data, undefined, 2))
        console.log(`Updated structure of ${file.name}`)
    } catch(err) {
        console.log(`Error in file ${file.name}, skipping.`)
        console.log(err.message)
    }
}