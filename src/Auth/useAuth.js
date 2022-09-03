import React,{ useState }  from "react";
import axios from "axios";
const authContext = React.createContext();

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

 /*  React.useEffect( ()=>{
    console.log('token from user useEffect', authed , '***');
    if (!authed) {
      console.log('user will become null');
      setUser({});
    } else {
      console.log(' useEffect ');
      setUser({});
    }
  }, [user]); */

  return {
    authed,
    user,
    login(data) {
      return new Promise((resolve, reject) => {
        setAuthed(true);
        console.log("Login called");
        axios.post(baseUrl + "/login", data)
          .then(({ data }) => {
            const token = "Bearer " + data.token
            setAuthed(true);
            setUser(data.user);
            console.log(authed,"ooo");
            localStorage.setItem("token", token);
            resolve(data);
          })
          .catch((error) => {
            console.log(error);
            reject(ersetAuthedror);
          })

      });
    },
    logout() {
      return new Promise((res) => {
        setAuthed(false);
        res();
      });
    },
  };
}

export function AuthProvider({ children }) 
{
  const auth = useAuth();
  const value = React.useMemo(
    () => (auth),
    [user]
  );
  console.log(value);
  return <authContext.Provider value={{auth,setAuthed}}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}