import nodemailer from "nodemailer";

const sendmail = async (email, id) => {
	try {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.email,
				pass: process.env.password,
			},
		});

		await transporter.sendMail({
			from: process.env.email,
			to: email,
			subject: "Please verify your email",
			text:
				"We will be so happy if you verify your email. To do so click the given link bellow",
			html: `<a href=http://localhost:5000/api/users/register/verify/${id}>verify email</a>`,
		});
	} catch (err) {
		console.log("nodemailer", err.message);
	}
};

export default sendmail;
