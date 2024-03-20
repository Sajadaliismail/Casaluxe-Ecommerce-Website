const { user, AddressSchema } = require("../../models/userSchema");

const editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const { name, street, landmark, state, city, district, zipcode, phonenumber } = req.body;
    await AddressSchema.findByIdAndUpdate(
      addressId,
      {
        name: name,
        street: street,
        landmark: landmark,
        state: state,
        city: city,
        district: district,
        postalCode: zipcode,
        phone: phonenumber,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.redirect("/myaccount");
  } catch (error) {
    return res.redirect("/myaccount");
  }
};

const addAddress = async (req, res) => {
  try {
    const id = req.userId;
    const { name, street, landmark, state, city, district, zipcode, phonenumber } = req.body;
    const userdata = await user.findById(id);
    const address = new AddressSchema({
      name: name,
      street: street,
      landmark: landmark,
      state: state,
      city: city,
      district: district,
      postalCode: zipcode,
      phone: phonenumber,
      user_id: id,
    });
    await address.save();
    userdata.addresses.push(address);
    await userdata.save();
    res.redirect("/myaccount");
  } catch (error) {
    console.log(error);
    return res.redirect("/myaccount");
  }
};

const defaultAddress = async (req, res) => {
  try {
    const indexValue = req.body.index;
    const id = req.userId;
    const userdata = await user
      .findById(id)
      .populate({ path: "addresses", model: "AddressSchema" });
    userdata.addresses.forEach((address) => {
      if (userdata.addresses.indexOf(address) == indexValue) {
        const defaultAddress = userdata.addresses[indexValue];
        userdata.addresses.splice(indexValue, 1);
        userdata.addresses.unshift(defaultAddress);
      }
    });
    await userdata.save();
    res.json({ success: "Done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const indexValue = req.body.index;
    const id = req.userId;
    const userdata = await user
      .findById(id)
      .populate({ path: "addresses", model: "AddressSchema" });
    userdata.addresses.forEach((address) => {
      if (userdata.addresses.indexOf(address) == indexValue) {
        userdata.addresses.splice(indexValue, 1);
      }
    });
    await userdata.save();
    res.redirect("/myaccount");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAddress = async (req, res) => {
  try {
    const indexValue = req.params.id;
    const id = req.userId;
    const userdata = await user
      .findById(id)
      .populate({ path: "addresses", model: "AddressSchema" });
    const data = userdata.addresses[indexValue];
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  editAddress,
  addAddress,
  defaultAddress,
  deleteAddress,
  getAddress,
};
