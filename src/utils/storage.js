import SecureLS from "secure-ls";

var ls = new SecureLS({});

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const clear = () => {
  localStorage.clear();
};

const storage = {
  setItem,
  getItem,
  clear,
};

export default storage;
