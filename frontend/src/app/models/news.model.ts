// export interface News {
//     title: string;
//     content: string;
//     thumbnail: File;
// }

export interface NewsResponse {
    _id: string;
    title: string;
    content: string;
    author: {};
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
}

export interface Author {
  _id: string;
  screenName: string;
}

export interface News {
  _id?: string;
  title: string;
  content: string | any;
  author?: Author;
  thumbnail: string | File;
  createdAt?: string;
  updatedAt?: string;
}
