import { useState } from "react";

function user(token) {
  return {
    _id:"23321321",
    name:"sainath",
    age:26
  }
}

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState( () => {
    try {
      // const navigate = useNavigate();
      const baseUrl = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem('token');
      let userData = null;
      
      if (token) {
         axios.get(baseUrl + "/profile", { headers: { Authorization: token ?? null } })
        .then(({ data }) => {
          console.log("i was here");
          userData = data
        });
      }

      const value =  userData;
      if (value) {
        console.log(value);
        return value;
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};