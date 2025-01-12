import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";
import { useState } from "react";

import { db } from "../../firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

function Customers() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    if (!nome || !cnpj || !endereco) {
      toast.info("Preencha todos os campos!");
      return;
    } else {
      //essa linha vai criar um novo documento no firebase
      await addDoc(collection(db, "clients"), {
        nameFantasia: nome,
        cnpj: cnpj,
        endereco: endereco,
      }).then(() => {
        setNome("");
        setCnpj("");
        setEndereco("");
        toast.success("Cliente cadastrado com sucesso!");
      });
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="clientes">
          <FiUser size={25} />
        </Title>
        <div className="contanier">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome do Fantasia</label>
            <input
              className="name-input"
              type="text"
              placeholder="Nome da empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>CNPJ / CPF</label>
            <input
              className="cnpj-input"
              type="text"
              placeholder="CNPJ / CPF"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              className="endereco-input"
              type="text"
              placeholder="Endereço da empresa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Customers;
