import React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiEdit2, FiPlus, FiSearch, FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./dashboard.css";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
} from "firebase/firestore";
import { db } from "../../firebaseConnection";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Modal from "../../components/Modal";

function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDoc, setLastDoc] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados() {
      const data = query(
        collection(db, "chamados"),
        orderBy("created", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(data);
      await updateState(querySnapshot);
      setLoading(false);
    }
    loadChamados();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;
    setChamados([]);

    if (!isCollectionEmpty) {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          clienteId: doc.data().ClienteId,
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });
      const _lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //pegando ultimo item da lista

      setChamados((chamados) => [...chamados, ...list]);
      setLastDoc(_lastDoc);
    } else {
      setIsEmpty(true);
    }
    setLoadingMore(false);
  }

  async function hadleLogout() {
    await logout();
  } // para desligar do sistema

  async function handleMore() {
    console.log(lastDoc);
    setLoadingMore(true);
    const data = query(
      collection(db, "chamados"),
      orderBy("created", "desc"),
      startAfter(lastDoc),
      limit(5)
    );

    const querySnapshot = await getDocs(data);
    updateState(querySnapshot);
  }
  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Incluir">
            <FiEdit2 size={25} />
          </Title>
          <div className="container dashboard">
            <h3>Buscando chamados...</h3>
          </div>
        </div>
      </div>
    );
  }

  function toggleModal(item) {
    setShowModal(!showModal);
    setDetail(item);
    console.log(item.complemento);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Incluir">
          <FiEdit2 size={25} />
        </Title>
        <>
          {chamados.length === 0 ? (
            <div className="container">
              <h3>Nenhum chamado encontrado...</h3>
              <Link to="/new" size={25} color="#fff" className="new">
                <FiPlus size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" size={25} color="#fff" className="new">
                <FiPlus size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Código">#01</td>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.status === "Aberto" ? "#5cb85c" : "#999",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado em">
                          {item.createdFormated}
                        </td>
                        <td data-label="Ações">
                          <Link
                            onClick={() => toggleModal(item)}
                            className="action"
                            style={{ backgroundColor: "#3586f6" }}
                          >
                            <FiSearch size={17} color="#fff" />
                          </Link>
                          <Link
                            to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit3 size={17} color="#fff" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loadingMore && <h3>Buscando chamados...</h3>}
              {!loadingMore && !isEmpty && (
                <button className="btnMore" onClick={handleMore}>
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
      </div>
      {showModal && (
        <Modal conteudo={detail} close={() => setShowModal(!toggleModal)} />
      )}
    </div>
  );
}
export default Dashboard;
