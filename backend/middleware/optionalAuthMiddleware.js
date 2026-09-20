import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // No token = guest user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

    } catch (err) {

        // Invalid token = treat as guest
        req.user = null;

    }

    next();
};

export default optionalAuthMiddleware;