let ConfigOverride
try{
    ConfigOverride = require("./config.json")
} catch (e) {
    // console.log(e)
}

const runConfig = () => {    
    this.config = {
        clientId: ConfigOverride 
                        ? ConfigOverride.clientId 
                        : process.env.CLIENT_ID,
        clientSecret: ConfigOverride
                        ? ConfigOverride.clientSecret
                        : process.env.CLIENT_SECRET,
        redirectUrls: ConfigOverride
                        ? ConfigOverride.redirectUrls
                        : process.env.REDIRECT_URLS
    }
}
runConfig()

module.exports = this.config