export default function tokenValidator(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send("Você não tem autorização, informe o token para continuar!");
  }
  res.locals.token = token;
  next();
}
