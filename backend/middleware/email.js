require("dotenv").config({ quiet: true })
const { Resend } = require("resend")

const Send = new Resend(process.env.RESEND_KEY)

async function SendEmail(gmail, nom, message) {
    try {
        const { data, error } = await Send.emails.send({
            from: `${nom} <onboarding@resend.dev>`,
            to: `${process.env.EMAIL}`,
            subject: `Contactez nous - ${nom} ${gmail}`,
            html: `<p>${message}</p>`
        })

        if (error)
            throw error
        
        return data
    } catch (err) {
        console.error(err);
    }
}

module.exports = { SendEmail }