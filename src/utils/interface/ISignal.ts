import type { IUser } from "./IUser"

export interface ISingalRequest{
    id      : number
    content : string
    user_fk : number
}

export interface ISingal{
    id          : number
    content     : string
    user_fk     : IUser
    dateCreated : string
}