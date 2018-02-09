const Hapi = require('hapi') 
const Config = require('./ServerConfig') 
const Google = require('googleapis')
const urlshortener = Google.urlshortener('v1')
const OAuth2 = Google.auth.OAuth2 

const server = Hapi.server({
    host: 'localhost',
    port: 3001
})

const oauth2Client = new OAuth2( 
    Config.clientId,
    Config.clientSecret,
    Config.redirectUrls
)

const scopes = [
    'https://www.googleapis.com/auth/calendar'
]


// Retrive tokens via token exchange or set them: 
// oauth2Client.setCredentials({
//     access_token: '',
//     refresh_token: ''
//     // Optional, provide an epiry_date (milliseconds since the Unix Epoch)
//     // const expiry_date: (newDate()).getTime() + (1000 * 60 * 60 * 24 *7) // this is commented out because I want to make it expire when they delete user. 
// })

// oauth2Client.refreshAccessToken(function(err, tokens) {

// })  
    // your access_token is now refreshed and stored in oauth2Client
    // store these new tokens in database)



// generate a url that asks permissions for Google+ and Google Calendar scopes



server.route({
    method: 'GET',
    path:'/login', 
    handler: async (request, h) => {
        const url = oauth2Client.generateAuthUrl({
            scope: scopes
        })
        return h.redirect(url) 
},
config: {
    cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
    }
}
})

server.route({
    method: 'GET',
    path:'/oauth2callback', 
    handler: async (request, h) => { 
        try {
        const tokens = await oauth2Client.getToken(request.query.code)
                oauth2Client.setCredentials(tokens)
            const calendar = Google.calendar({
            version: 'v2',
        auth: oauth2Client
        })
        console.log('Calendar', calendar)
        // access calendar information here 
        return 'okay' 
    } catch (err) {
        console.log(err)
        return err
    }
        
//         , function (err, tokens) {
//     // Now tokens contains an access_token and an optional refresh_token. Save them.
//     if (!err) {
//         oauth2Client.setCredentials(tokens)
//         const calendar = Google.calendar({
//         version: 'v2',
//         auth: oauth2Client
//         })
//     return h.response(calendar) 
//     }
//     return h.response(err) 
// }
// ) 


},
config: {
    cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
    }
}
})



async function start() {
    
        try {
            await server.start()
        }
        catch (err) {
            console.log(err)
            process.exit(1)
        }
    
        console.log('Server running at:', server.info.uri)
    }
    
    start()

