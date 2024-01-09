const AdminCollection = require('../model/adminDetails');
const bcrypt = require("bcrypt");

module.exports={
    loginGet:(req,res)=>{
        res.render('admin/login')
    },
    loginPost:async(req,res)=>{
            try {
                const { email, password } = req.body;
                const admin = await AdminCollection.findOne({ email });
        
                if (!admin) {
                    // Handle case where the user is not found (email doesn't exist)
                    return res.render('admin/login', { message: 'Invalid email or password' });
                }
        
                // Compare the entered password with the hashed password from the database
                const passwordMatch = await bcrypt.compare(password, admin.password);
        
                if (passwordMatch) {
                    // Passwords match, redirect to dashboard or any other authenticated route
                    return res.redirect('/admin/dashboard');
                } else {
                    // Passwords do not match
                    return res.render('admin/login', { message: 'Invalid email or password' });
                }
            } catch (error) {
                console.log('admin/login', error);
                // Handle other errors that might occur during the login process
                return res.render('admin/login', { message: 'An error occurred' });
            }
    },
    adminDashboard:(req,res)=>{
        res.render('admin/dashboard')
    }
}