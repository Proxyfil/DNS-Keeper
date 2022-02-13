//Imports
const { exec } = require("child_process");
var cf = require('cloudflare')({
    token: process.env.cloudflare_token
  });
const yaml = require('js-yaml')
const fs = require('fs');

//Functions Declarements
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Var Declarements
let fileContents = fs.readFileSync('./config.yml', 'utf8');
let data = yaml.load(fileContents);

let zone_id = data.zone_id
let id = data.id

async function keepDNS(ip,dns_record){
    while (true){
        exec("curl 'https://api.ipify.org?format=json%27'", async (error, stdout, stderr) => {
            if(!error){
                var check_ip = stdout
                
                if(check_ip != ip){
                    dns_record.content = check_ip
                    cf.dnsRecords.edit(zone_id,id,dns_record)
                    console.log(`LOG : DNS dramaquiz.fr record changed for ${check_ip}`)
                    ip = check_ip
                }
                else{
                    //console.log(`check IP : ${check_ip} | saved IP : ${ip}`) 
                }
            }
            else{
                console.log(`ERROR ON REQUEST : ${error}`)
            }
        })
        await sleep(60 * 1000);
    }
}

exec("curl 'https://api.ipify.org?format=json%27'", async (error, stdout, stderr) => {
    var ip = stdout
    var dns_record = await cf.dnsRecords.read(zone_id,id)
    keepDNS(ip,dns_record.result)
})