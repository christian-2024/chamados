import { useState, createContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConnection";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = localStorage.getItem("@detailUser");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);
  async function singIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        let data = {
          uid: uid,
          email: value.user.email,
          name: docSnap.data().nome,
          avatarUrl: docSnap.data().avatarUrl,
        };
        setUser(data);
        storageUser(data);
        console.log("Usuario logado com sucesso");
        setLoadingAuth(false);
        toast.success("Bem-vindo ao Sistema de chamados!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Algo deu errado" + error);
        setLoadingAuth(false);
        toast.error("Ops, verifique suas credenciais!");
      });
  }
  //cadastrar novo usuario
  async function singUp(email, password, name) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: name,
          avatarUrl: null,
        }).then(() => {
          // alert("usuario cadastrado com sucesso");

          let data = {
            uid: uid,
            email: value.user.email,
            name: name,
            avatarUrl: null,
          };
          setUser(data);
          setLoadingAuth(false);
          storageUser(data);
          toast.success("Seja bem-vindo ao Sistema de chamados!");
          navigate("/dashboard");
        });
      })
      .catch((error) => {
        console.log("apresentou erro" + error);
        setLoadingAuth(false);
      });
  }
  function storageUser(data) {
    localStorage.setItem("@detailUser", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@detailUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        singIn,
        singUp,
        logout,
        loading,
        loadingAuth,
        storageUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
