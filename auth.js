// [IMPORT MODULES]
const jwt = require("jsonwebtoken");

const secret = "EcommerceAPI";

// [TOKEN CREATION]
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, secret, {});
}

// [TOKEN VERIFICATION]
module.exports.verify = (req,res, next) => {

	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({ auth: "Failed. No token"})
	}
	else{
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		jwt.verify(token, secret, function(err, decodedToken){

			if(err){
				return res.send(
				{
					auth: "Failed",
					message: err.message
				});
			}
			else{
				console.log("result from verify method: ");
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) =>{

	if(req.user.isAdmin){
		next();
	}

	else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}

}