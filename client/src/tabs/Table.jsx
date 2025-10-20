import React, { useEffect, useState } from "react"; //controlan cambios y recarga de tabla

function Table() {

  //estado actual
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
    const res = await fetch(  //hacemos fetch al backend
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



//control de cambio de paginas
//al cambiar, se vuelve a ejecutar useEffect
const handlePrev = () => setPage((p) => Math.max(p - 1, 1));  //resta una pagina, sin bajar de 1
const handleNext = () => setPage((p) => Math.min(p + 1, totalPages)); //suma una pagina, sin pasar de Total



//estilo de la tabla y generacion de columnas y filas dinamicamente
return (
  <div style={{  //estilo
    backgroundColor: "#060606",
    width: "100%",
    minHeight: "100%",
    padding: "2rem",
    boxSizing: "border-box",
    color: "white",
    overflow: "auto"
  }}>
    <h1 style={{color: "white"}}>Tabla de Documentos</h1>  

    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      color: "white",
      minWidth: "800px"
    }}>
    {/* Columnas y filas */}
      <thead>
        <tr>
        {/* Mientras haya documentos, devuelve un array con los titulos (keys) de las columnas */}
        {/* Por cada columna (key) genera una <th> (columna)*/}
          {documents[0] && Object.keys(documents[0]).map((key) => (
             <th key={key} style={{border: "1px solid white", padding: "0.5rem"}}>
              {key}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* Recorre los documentos completos obtenidos del backend */}
        {documents.map((doc) => (
          <tr key={doc._id}> {/* Cada doc crea una <tr> (fila) */}
            {Object.keys(doc).map((key) => ( 
              <td key={key} style={{border: "1px solid white", padding: "0.5rem"}}>  {/* Para cada columna del doc genera <td> (celda) */}
                {doc[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{marginTop: "1rem"}}>
       {/* Botones de cambio de pagina */}
      <button onClick={handlePrev} disabled={page === 1}>Previous</button>  {/*Anterior*/}
      <span style={{margin: "0 1rem"}}>Página {page} de {totalPages}</span>   {/*Marcador pagina actual*/}
      <button onClick={handleNext} disabled={page === totalPages}>Next</button>  {/*Siguiente*/}
    </div>
  </div>
);




}
export default Table