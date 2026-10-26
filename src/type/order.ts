import type { product } from "./product";


export type Order = {
    id : string;
    date : string;
    customer: {
        fullName : string;
        email : string;
        address : string;
        city : string;
        postalcode : string;
        country : string;
    };
    items: {
        product: product;
        quantity : number;
    }[];
    subtotal :number;
    shipping : number;
    total : number;
};