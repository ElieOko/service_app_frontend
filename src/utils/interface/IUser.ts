export interface IUser{
    nomUser  : string
    role     : string
    password : string
    isActive : boolean
}

export interface IAuth{
    nomUser  : string
    password : string
}