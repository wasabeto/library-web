export interface Book {
  id: string;
  title: string;
  genre: string;
  author: {
    name: string;
    age: number;
    books: number;
  };
  published: number;
}

export interface BookResponse {
  count: number;
  rows: Book[];
}


