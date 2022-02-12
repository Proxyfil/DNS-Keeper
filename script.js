//Imports
const { exec } = require("child_process");
var cf = require('cloudflare')({
    token: process.env.cloudflare_token
  });

//Functions Declarements
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function keepDNS(ip,dns_record){
    while (true){
        exec("curl 'https://api.ipify.org?format=json%27'", async (error, stdout, stderr) => {
            if(!error){
                var check_ip = stdout
                
                if(check_ip != ip){
                    dns_record.content = check_ip
                    cf.dnsRecords.edit("f4b17898e218d4eaf3db27dbf33fbda1","c1272f01f119c1ac1844061bf30f3a05",dns_record)
                    console.log(`LOG : DNS dramaquiz.fr record changed for ${check_ip}`)
                    ip = check_ip
                }
                else{
                    console.log(`check IP : ${check_ip} | saved IP : ${ip}`) 
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
    var dns_record = await cf.dnsRecords.read('f4b17898e218d4eaf3db27dbf33fbda1','c1272f01f119c1ac1844061bf30f3a05')
    keepDNS(ip,dns_record.result)
})