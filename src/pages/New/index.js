import React from "react";
import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";
import "./new.css";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../firebaseConnection";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function New() {
  //esse comando é para chamar dados do banco de dados
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  // aqui vai a lista de clientes que sera colocada

  const [custumers, setCustumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerSelected, setCustomerSelected] = useState("");

  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [status, setStatus] = useState("Aberto");
  const [descricao, setDescricao] = useState("");
  const [idCustomer, setIdCustomer] = useState(false);

  useEffect(() => {
    async function loadCustumers() {
      const querySnapshot = await getDocs(collection(db, "clients"))
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nameFantasia: doc.data().nameFantasia,
            });
          });
          if (snapshot.docs.size === 0) {
            console.log("nenhuma empresa");
            setCustumers([
              {
                id: "1",
                nomeFantasia: "Freela",
              },
            ]);
            setLoading(false);
            return;
          }
          setCustumers(lista);
          setLoading(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("Erro ao buscar clientes" + error);

          setLoading(false);
          setCustumers([
            {
              id: "1",
              nomeFantasia: "Freela",
            },
          ]);
        });
    }
    loadCustumers();
  }, [id]); //esse id e de dependencia do useEffect

  // esse loadId e lista que vai ser usada para pegar o id do cliente
  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setCliente(snapshot.data().cliente);
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setDescricao(snapshot.data().complemento);
        let index = lista.findIndex(
          (item) => item.id === snapshot.data().ClienteId
        );
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        setLoading(false);
        setIdCustomer(false);
        navigate("/dashboard");
      });
  }

  function handleChangeCustumer(e) {
    setCustomerSelected(e.target.value);
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }
  function handleSelectAssunt(e) {
    setAssunto(e.target.value);
  }
  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      //  atualizando chamado
      const docRef = doc(db, "chamados", id);
      await updateDoc(docRef, {
        cliente: custumers[customerSelected].nameFantasia,
        ClienteId: custumers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: descricao,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!");
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error("Erro ao atualizar o chamado!");
          console.log("Erro ao registrar o chamado" + error);
        });

      return;
    }

    // registrar chamado
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: custumers[customerSelected].nameFantasia,
      ClienteId: custumers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: descricao,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado registrado com sucesso!");
        setCustomerSelected("");
        setDescricao("");
        setAssunto("");
        setStatus("Aberto");
      })
      .catch((error) => {
        console.log("Erro ao registrar o chamado" + error);
      });
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editar chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {loading ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustumer}>
                <option value="" disabled>
                  Selecione o cliente
                </option>
                {custumers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nameFantasia}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleSelectAssunt}>
              <option value="" disabled>
                Selecione o assunto
              </option>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Aberto"
                  onChange={handleOptionChange}
                  checked={status === "Aberto"}
                />
                <span>Aberto</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Progresso"
                  onChange={handleOptionChange}
                  checked={status === "Progresso"}
                />
                <span>Progresso</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Finalizado"
                  onChange={handleOptionChange}
                  checked={status === "Finalizado"}
                />
                <span>Finalizado</span>
              </label>
            </div>
            <label>Descrição</label>{" "}
            <div className="form-area">
              <textarea
                type="text"
                placeholder="Digite a descrição aqui..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
              <button type="submit">Incluir</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default New;
