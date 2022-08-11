const accountSid = 'AC5a71ef12e48ac70675bb96256b3a84f6'; // My Account SID from www.twilio.com
const authToken = '5dd1b252871b0bd63abca4ddf45ce21d';   //  My Token from www.twilio.com
const client = require('twilio')(accountSid, authToken);
function Goi_Tin_nhan(so_dien_thoai, noi_dung) {
    //  Promise
    return client.messages.create({
        body: noi_dung,
        to: so_dien_thoai,
        from: '+19206898202' // Số điện thoại Twillio cung cấp 
    })
}

module.exports = Goi_Tin_nhan