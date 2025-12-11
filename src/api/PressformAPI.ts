import type { AxiosResponse } from "axios";
import axios from "axios";



export interface Pressform {
    id?: string;
    name: string; // название пресс-формы
    description: string; // описание пресс-формы
    weight: number // вес пресс-формы
    parts: number // кол-во частей пресс-формы
    length: number // длина пресс-формы в мм
    width: number // ширина пресс-формы в мм
    height: number // высота пресс-формы в мм
    manufacturer: string // производитель пресс-формы
    installationTime: number // время монтажа пресс-формы в мин
    deinstallationTime: number // время демонтажа пресс-формы в мин
    active: boolean // в эксплуатации или на ремонте
    products?: { id: string; name?: string }[];
    semiproducts?: { id: string; name?: string }[];
}

const BASE = "/api/pressforms";

const PressformAPI = {
    getAll: ():Promise<AxiosResponse<Pressform[]>> => axios.get(BASE),
    get: (id: string): Promise<AxiosResponse<Pressform>> => axios.get(`${BASE}/${id}`),

    create: (data: Pressform) => axios.post(BASE, data),
    update: (id: string, data:Pressform) => axios.put(`${BASE}/${id}`, data),
    delete: (id: string) => axios.delete(`${BASE}/${id}`)
};

export default PressformAPI