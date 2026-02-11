const signup = (req, res) => {
    const {name, email, password} = req.body
  res.json({ message: "🟢 User signup successful", name: name, email: email, password: password});
};

export { signup };
