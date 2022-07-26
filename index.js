const TwitterApi = require('twitter-api-v2').TwitterApi
const fs = require('fs');
require('dotenv').config()

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);

// Tell typescript it's a readonly app
const roClient = twitterClient.readOnly;

const main = async () => {
    // await pull(roClient)

    if(!fs.existsSync('tweets'))
        fs.mkdirSync('tweets')

    const tweets = fs.readFileSync('tweets.txt').toString().split('\n')
    console.log(`Found ${tweets.length} tweets`)

    for(const tweet of tweets) {
        if(fs.existsSync(`tweets/${tweet}.json`)) {
            console.log(`Tweet data found, continuing. ${tweet}`)
            continue
        }
        
        let userLikes = [], userRts = [], userQuotes = []

        try{
            console.log('Pulling likes...')
            for await(const user of await roClient.v2.tweetLikedBy(tweet, { asPaginator: true })) {
                userLikes.push(user)
            }

            await (new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }))
            
            console.log(`${userLikes.length} Likes`)
            await (new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }))

            console.log('Pulling RTs...')
            userRts.push(...(await roClient.v2.tweetRetweetedBy(tweet)).data)
            console.log(`${userRts.length} Retweets`)
            await (new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }))

            console.log('Pulling QTs...')
            userQuotes.push((await roClient.v2.get(`tweets/${tweet}/quote_tweets`)).data)
            console.log(`${userQuotes.length} Quote Tweets`)
            await (new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }))

            fs.writeFileSync(`tweets/${tweet}.json`, JSON.stringify({ likes: userLikes, retweets: userRts, quotes: userQuotes }, undefined, 2))
            console.log(`${tweet} saved to file.`)

            await (new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }))
        } catch(err) {
            console.log('ERROR')
            if(err.rateLimit) {
                let end = new Date(err.rateLimit.reset * 1000)
                console.log('Waiting')
                console.log(`Waiting for rate limit... (${end.toString()}) (in ${(end.getTime() - Date.now() + 5000) / 1000} seconds)`)
                setTimeout(async () => {
                    console.log('Trying again')
                    await main()
                }, end.getTime() - Date.now() + 5000)
                
                return
            } else {
                console.log(err.message)
                process.exit(1)
            }
        }
    }
}

const analyze = async (roClient) => {

}

const pull = async (roClient) => {
    const timeline = await roClient.v2.userTimeline('800034867568328708', {
        max_results: 100,
        end_time: '2022-04-30T00:00:00Z',
        start_time: '2022-03-28T00:00:00Z',
        exclude: ['replies', 'retweets'],
        "tweet.fields": ['public_metrics']
    })

    let tweets = []

    for await(const tweet of timeline.fetchAndIterate()) {
        if(tweet[0] && tweet[0].text.includes('#LevelNextRLTakis')) {
            tweets.push(tweet[0].id)
            console.log(`(${tweet[0].public_metrics.like_count} likes, ${tweet[0].public_metrics.retweet_count} rts, ${tweet[0].public_metrics.quote_count} quotes, ${tweet[0].public_metrics.reply_count} replies) "${tweet[0].text}" [${tweet[0].id}]`)
        }
    }
    fs.writeFileSync('tweets.txt', tweets.join('\n'))

}

main()