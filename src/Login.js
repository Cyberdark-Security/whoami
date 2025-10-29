export default function Login() {
  return (
    <div>
      <h2 style={{ color: "#44FF44" }}>Iniciar sesión</h2>
      <form>
        <div>
          <label>Correo electrónico:</label>
          <input type="email" name="email" required style={{ width: "100%", marginBottom: "12px" }} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" required style={{ width: "100%", marginBottom: "12px" }} />
        </div>
        <button type="submit" style={{width:"100%",padding:"8px 0",fontWeight:600}}>Entrar</button>
      </form>
    </div>
  );
}
