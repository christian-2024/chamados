import React from "react";
import logo from "../../assest/olivesoft.png";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

function SingUp() {
  const [name, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { singUp, loadingAuth } = useContext(AuthContext);

  async function handleRegister(e) {
    e.preventDefault();
    if (name !== "" && email !== "" && password !== "") {
      if (password === confirmPassword) {
        //       //alert(`Nome: ${nome} \nE-mail: ${email} \nSenha: ${password}`);
        //       await createUserWithEmailAndPassword(auth, email, password)
        //         .then(() => {
        //           console.log("Usuario cadastrado com sucesso");
        //         })
        //         .catch((error) => {
        //           console.log("Algo deu errado" + error);
        //         });
        //       setNome("");
        //       setEmail("");
        //       setPassword("");
        //       setConfirmPassword("");
        await singUp(email, password, name);
        setEmail("");
        setNome("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert("Senhas diferentes");
      }
    } else {
      alert("Faça o login completo");
    }
  }

  return (
    <div className="contanier-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo-OliveSoft" />
        </div>
        <form onSubmit={handleRegister}>
          <h1>Nova conta</h1>
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            autoComplete="off"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            autoComplete="off"
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <Link to="/">Já possiu uma conta? Faça login</Link>
      </div>
    </div>
  );
}

export default SingUp;
