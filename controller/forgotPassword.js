const AdminCollection = require("../model/adminDetails");
const ResetToken = require("../model/token");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = {
  resetPassword: (req, res) => {
    res.render("admin/forgot-password");
  },
  resetPasswordPost: async (req, res) => {
    const email = req.body.email;
    try {
      const admin = await AdminCollection.findOne({ email });
      if (!admin) {
        return res.render("admin/forgot-password", {
          message: "email does not exist!",
        });
      }
      // generate a token for this user and save it to the database
      const token = crypto.randomBytes(20).toString("hex");
      const hashedToken = await bcrypt.hash(token, 10);

      const newToken = new ResetToken({
        token: hashedToken,
        adminId: admin._id, // Associate the token with the user's _id
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Set the token to expire in 10 min
      });
      await newToken.save();

      const transporter = nodemailer.createTransport({
        // Send an email with a reset link
        service: "gmail",
        auth: {
          user: "thasleem.1tk@gmail.com",
          pass: "quemrgoztqvkqrvx",
        },
      });
      const mailOption = {
        from: "thasleem.1tk@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `Click this link to reset your password: http://localhost:3000/admin/reset/${hashedToken}`,
      };
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log(error);
          return res.render("admin/forgot-password", {
            message: "Error sending email",
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.render("admin/forgot-password", {
            message: "Password reset link sent to your email",
          });
        }
      });
    } catch (error) {
      console.log("Error in /admin/resetPassword", error);
    }
  },
  updatePassword: (req, res) => {
    try {
      const resetToken = req.params.token;
      console.log(resetToken);
      res.render("admin/resetPassword", { resetToken });
    } catch (error) {
      console.log("/reset/:token Error", error);
    }
  },
  updatePasswordPost: async (req, res) => {
    const resetToken = req.params.token;
    const newPassword = req.body.password; // Assuming you have a field in the form with name 'password'

    try {
      // Find the reset token in the database
      const token = await ResetToken.findOne({ token: resetToken });

      if (!token || token.expiresAt < new Date()) {
        // Token not found or expired
        return res.render("admin/resetPassword", {
          message: "Invalid or expired token",
        });
      }
      // Find the user associated with this token
      const admin = await AdminCollection.findById(token.adminId);

      if (!admin) {
        return res.render("admin/resetPassword", { message: "User not found" });
      }
      // Hash the new password and update the user's password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();
      // Delete the reset token from the database using the _id field
      await ResetToken.deleteOne({ _id: token._id });
      // Redirect the user to a login page or any other appropriate page
      return res.redirect("/admin/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error in /reset/:token", error);
      return res.render("admin/resetPassword", {
        message: "An error occurred",
      });
    }
  },
};
