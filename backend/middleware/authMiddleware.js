import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "No token provided"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information in req.user
        req.user = decoded;
        console.log("Logged in user:", req.user);
        // Continue to the route
        next();

    } catch (err) {
        console.log(err);

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};

export default authMiddleware;