# DNS-Keeper
NodeJS Script to keep Cloudflare DNS Updated

## Requirements :
 - env_variable cloudflare token as **"cloudflare_token"**
 - cloudflare lib (npm install cloudflare)
 - js-yaml lib (npm install js-yaml)

## Usage :
 - modify **config.yml** to match with your credentials
 - **"node script.js"** to start
 - Should be kept in screen or sub-process running
 - 1 Minute delay
 - Set zone_id as **""** in config to get the list of your dns records
