import "./modal.css";
import { FiX } from "react-icons/fi";

function Modal({ conteudo, close }) {
  console.log(conteudo.complemento);
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX sixe={25} color="#fff" />
          Voltar
        </button>
        <main>
          <h2>Detalhes do chamado</h2>

          <div className="row">
            <span>
              Cliente: <i>{conteudo.cliente}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Assunto: <i>{conteudo.assunto}</i>
            </span>
            <span>
              Cadastrado em: <i>{conteudo.createdFormated}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Status:{" "}
              <i
                className="status-info"
                style={{
                  color: "#fff",

                  backgroundColor:
                    conteudo.status === "Aberto" ? "#5cb85c" : "#999",
                }}
              >
                {conteudo.status}
              </i>
            </span>
          </div>

          {conteudo.complemento !== "" && (
            <>
              <h3>Descrição</h3>
              <p>{conteudo.complemento}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
export default Modal;
