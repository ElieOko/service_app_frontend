import axios, { type AxiosInstance } from "axios";
//https://www.jstoolset.com/jwt
export const useAxiosRequestWithToken = (tokens:string = "") : AxiosInstance  =>{
    const useAxios: AxiosInstance = axios.create({
        baseURL               : "http://127.0.0.1:8000/api/",
        headers   : {
          "Content-type"      :   "application/json",
          "X-Requested-With"  :   "XMLHttpRequest",
        //   "Authorization"     :   `Bearer ${token}`
        },
      })
      return useAxios
}