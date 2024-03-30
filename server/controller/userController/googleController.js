const axios = require('axios');
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET
const { user } = require("../../models/userSchema");
const { Cart, Wishlist,Item } = require("../../models/cartSchema");
const generateReferralCode = require("../../services/referralCodeGenerator");
const { wallet } = require("../../models/walletSchema");

const authorizationUrl = require('../../services/googleAPI');



 const authorizationURL = (req, res) => {
  res.redirect(authorizationUrl);
}

const callbackGoogle = async (req, res) => {
  const code = req.query.code;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Authentication failed.');
  }
}


  const oauthGoogle = async (req, res) => {
    const { code } = req.query;
    try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const accessToken = response.data.access_token;
    console.log(accessToken, "token", response);
    const userInfoResponse = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = userInfoResponse.data;
    console.log(userInfo.names[0].displayName);
    const email = userInfo.emailAddresses[0].value;
    const userData = await user.findOne({ email: email });
    console.log(userInfo.emailAddresses[0].value);
    if(userData)
   { const token = jwt.sign({ userId: userData.id }, secret, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");}
    else{
      const referral = generateReferralCode(userInfo.names[0].displayName);

      const data = new user({
        name : userInfo.names[0].displayName,
        email : userInfo.emailAddresses[0].value,
        isBlocked: false,
        isEmailVerified: true,
        addressess: [],
        otpemail: [],
        referralCode: referral,
      });

      const walletUser = new wallet({ _id: data._id });
      const wishlist = new Wishlist({ _id: data._id });
      const cart = new cartSchema({ _id: data._id });
      await Promise.all([walletUser.save(), data.save(),wishlist.save(),cart.save()]);
      const token = jwt.sign({ userId:  data._id }, secret, {
        expiresIn: "1d",
      });
      res.cookie("jwt", token, { httpOnly: true });
      res.redirect('/')
    }
} catch (error) {
  res.redirect('/')
  
}
};



module.exports = {authorizationURL,oauthGoogle,callbackGoogle}


