import React from "react";
import logo from "../../assest/olivesoft.png";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./singin.css";
import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../contexts/auth";
function SingIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { singIn, loadingAuth } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    if (email !== "" && password !== "") {
      //      //alert(`E-mail: ${email} \nSenha: ${password}`);
      //      await signInWithEmailAndPassword(auth, email, password)
      //       .then(() => {
      //          console.log("Usuario logado com sucesso");
      //        })
      //       .catch((error) => {
      //        console.log("Algo deu errado" + error);
      //    });
      //setEmail("");
      //    setPassword("");
      await singIn(email, password);
    } else {
      alert("faça o login completo");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="contanier-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo-OliveSoft" />
        </div>
        <form onSubmit={handleLogin}>
          <h1>Entrar</h1>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Conectando..." : "Acessar"}
          </button>
        </form>
        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SingIn;
