import fs from "fs";

const log = (message) => {
	fs.appendFile("logs/logs.txt", message, (e) => {
		if (e) console.log(e);
	});
};

export default log;
