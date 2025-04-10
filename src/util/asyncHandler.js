const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: "false",
                message: error.message || "Internal server error"
            });
        }
    }
}

export default asyncHandler;