import React, { useEffect, useState } from "react"; //controlan cambios y recarga de tabla

function Table() {
  const [documents, setDocuments] = useState([]);   // guarda los datos que vienen de mongodb y los actualiza
  const [page, setPage] = useState(1);  //determina la pagina actual y la cambia
  const [totalPages, setTotalPages] = useState(1); //numero de paginas calculada a partir de la cantidad de documentos
  const limit = 100;  //cantidad de filas por pagina

useEffect(() => {
  fetchDocuments(page);  //se ejecuta con cada cambio de pagina, actualiza datos
}, [page]);



//se extraen los datos del backend
const fetchDocuments = async (page) => {  
  try {
    const res = await fetch(
      `/documents?page=${page}&limit=${limit}`,  //se le pasa page y limit para paginacion
      { headers: { "Content-Type": "application/json" } }
    );
    const data = await res.json();
    if (data.success) {
      setDocuments(data.data);  //guarda los documentos recibidos
      setTotalPages(Math.ceil(data.pagination.total / limit)); //calcula total de paginas
    } else {
      console.error("Error fetching documents:", data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

export default Table