export const testAPI = async (req, res, next) => {
  try {
    res.json({ message: 'Hello from the backend!' });
  } catch (error) {
    next(error);
  }
};

export const testPOST = async (req, res, next) => {
    try{
        const data = req.body;
        const message = "Hi! Here's what we received";
        res.json({ message: message, data: data });
    } catch (error) {
        next(error);
    }
};
