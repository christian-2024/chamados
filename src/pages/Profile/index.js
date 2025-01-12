import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatarImg from "../../assest/avatar.png";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { useState } from "react";
import "./profile.css";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseConnection";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Profile() {
  const { user, setUser, storageUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);

  function handleFile(e) {
    const image = e.target.files[0];
    console.log(e.target.files);
    if (image) {
      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Verifique o formato enviado.");
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload() {
    const avararRef = ref(storage, `images/${user.uid}/${imageAvatar.name}`);
    const upload = uploadBytes(avararRef, imageAvatar).then(
      async (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          let urlPhoto = downloadURL;
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, {
            avatarUrl: urlPhoto,
            nome: nome,
          }).then(() => {
            let data = {
              ...user,
              name: nome,
              avatarUrl: urlPhoto,
            };
            setUser(data);
            storageUser(data);
            toast.success("Atualizado com sucesso!");
          });
        });
      }
    );
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== "") {
      //atualizar apenas o nome
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
      })
        .then(() => {
          let data = {
            ...user,
            name: nome,
          };
          setUser(data);
          storageUser(data);
          toast.success("Nome alterado com sucesso!");
        })
        .catch((error) => {
          console.log("não conseguimos atualizar o nome." + error);
        });
    } else if (nome !== "" && imageAvatar !== null) {
      //atualizar nome e imagem
      handleUpload();
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>
        <div className="contanier">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload size={25} color="#fff" />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />{" "}
              <br />
              {avatarUrl === null ? (
                <img
                  src={avatarImg}
                  alt="foto de perfil"
                  width="200px"
                  height="200px"
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="foto de perfil"
                  width="200px"
                  height="200px"
                />
              )}
            </label>
            <label>Nome</label>
            <input
              value={nome}
              className="name-input"
              type="text"
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Email</label>
            <input value={email} className="email-input" disabled={true} />
            <button type="submit">Salvar</button>
          </form>
        </div>
        <div className="contanier">
          <button className="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
