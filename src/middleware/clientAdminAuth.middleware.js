const clientAdminAuth = async (req, res, next) => {
    try {
        if(!req.user)  return res.redirect("/view/admin-login");

        if (!req.user.isAdmin) return res.redirect("/view/login");

        next();
    } catch (error) {
        console.error("Error in clientAdminAuth middleware: ", error.message);
        return res.redirect("/view/adminlogin");        
    }
};

export default clientAdminAuth;
