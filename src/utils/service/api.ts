import axios, { type AxiosInstance } from "axios";
//https://www.jstoolset.com/jwt
export const useAxiosRequestWithToken = (tokens:string = "") : AxiosInstance  =>{
    const useAxios: AxiosInstance = axios.create({
        baseURL               : "http://localhost:8000/api",
        headers   : {
          "Content-type"      :   "application/json",
          "X-Requested-With"  :   "XMLHttpRequest",
        //   "Authorization"     :   `Bearer ${token}`
        },
      })
      return useAxios
}
//https://server.drapeauyamboka.com/api/