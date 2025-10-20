import React, { useEffect, useState } from "react"; //controlan cambios y recarga de tabla

function Table() {

  //estado actual
  const [documents, setDocuments] = useState([]);   // guarda los datos que vienen de mongodb y los actualiza
  const [page, setPage] = useState(1);  //determina la pagina actual y la cambia
  const [totalPages, setTotalPages] = useState(1); //numero de paginas calculada a partir de la cantidad de documentos
  const limit = 100;  //cantidad de filas por pagina

useEffect(() => {
  // Creamos 50 documentos de prueba
    const mockDocs = Array.from({ length: 102 }, (_, i) => ({
      _id: i + 1,
      age: 20 + (i % 102),
      job: i % 2 === 0 ? "housemaid" : "technician",
      marital: i % 3 === 0 ? "married" : "single",
      education: "basic.4y",
      default: "no",
      housing: "no",
      loan: "no",
      contact: "telephone",
      month: "may",
      day_of_week: "mon",
      duration: 100 + i,
      campaign: 1,
      pdays: 999,
      previous: 0,
      poutcome: "nonexistent",
      "emp.var.rate": 1.1,
      "cons.price.idx": 93.994,
      "cons.conf.idx": -36.4,
      euribor3m: 4.857,
      "nr.employed": 5191,
      y: "no"
    }));
    setTotalPages(Math.ceil(mockDocs.length / limit));

  // Mostrar solo los documentos de la página actual
  setDocuments(mockDocs.slice((page - 1) * limit, page * limit));
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

    {/* Titulo */}
    <div style={{
      backgroundColor: "#1f1f1f",   
      borderRadius: "12px",      
      padding: "1rem 3rem",  
      margin: "1rem 0",          
      maxWidth: "85%",         
      marginLeft: "auto",     
      marginRight: "auto",
      textAlign: "center"      
    }}>
      <h1 style={{ color: "white", margin: 0 }}>
        Datos en Tabla
      </h1>
    </div>

    {/* Contenedor del botón y label */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      padding: "0 4.5rem"
    }}>
      {/* Boton exportar */}
      <button style={{
        padding: "0.75rem 1.5rem", 
        fontSize: "1.1rem",        
        backgroundColor: "#0D4A6B",
        color: "white",
        border: "none",
        borderRadius: "6px", // redondito
        cursor: "pointer"
      }}>
        Exportar CSV
      </button>

      {/* Cantidad registros */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        padding: "0.5rem 1rem", 
        border: "4px solid #44A1B4",
        borderRadius: "8px", //redondito
        color: "white",
        fontWeight: "bold",
        backgroundColor: "#0D4A6B"
      }}>
        <span style={{fontSize: "1.5rem"}}>{documents.length}</span>
        <span style={{fontSize: "0.9rem"}}>REGISTROS</span>
      </div>
    </div>

    {/* La tabla */}
    <div style={{
      backgroundColor: "#060606",
      width: "100%",
      minHeight: "100%",
      padding: "2rem",        
      boxSizing: "border-box",
      color: "white",
      overflow: "auto"
    }}>
      <table style={{
        width: "90%",          
        maxWidth: "1200px",   
        margin: "0 auto",       
        borderCollapse: "collapse",
        color: "white"
      }}>
        {/* Columnas */}
        <thead>
          <tr style={{ backgroundColor: "#2a2a2a"}}> {/* color distinto para títulos */}
            {/* Mientras haya documentos, devuelve un array con los titulos (keys) de las columnas */}
            {/* Por cada columna (key) genera una <th> (columna)*/}
            {documents[0] && Object.keys(documents[0]).map((key) => (
              <th key={key} style={{border: "1px white", padding: "0.75rem 1.5rem", fontWeight: "500", minWidth: "110px"}}>
                {key}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas */}
        <tbody>
          {/* Recorre los documentos completos obtenidos del backend */}
          {documents.map((doc, index) => (
            <tr key={doc._id} style={{ backgroundColor: index % 2 === 0 ? "#0c4d63ff" : "#6a6a6aff" }}> {/* filas alternadas */}
              {Object.keys(doc).map((key) => ( 
                <td key={key} style={{border: "none", padding: "1rem", textAlign: "center", verticalAlign: "middle"}}>  {/* Para cada columna del doc genera <td> (celda) */}
                  {doc[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Botones de cambio de página */}
    <div style={{
      display: "flex",
      justifyContent: "center",   
      alignItems: "center",
      gap: "1rem",                
      marginTop: "1.5rem"
    }}>
      {/* Botón anterior */}
      <button onClick={handlePrev} disabled={page === 1} style={{
        padding: "0.5rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#17749fff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: page === 1 ? 0.5 : 1   //cuando es 1, 0.5. sino 1
      }}>
        Back
      </button>

      {/* Número de página dentro de un círculo */}
      <div style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%", // círculo
        backgroundColor: "#44A1B4",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "1rem"
      }}>
        {page}
      </div>

      {/* Total de páginas */}
      <span style={{color: "white", fontSize: "1rem"}}>/ {totalPages}</span>

      {/* Botón siguiente */}
      <button onClick={handleNext} disabled={page === totalPages} style={{
        padding: "0.5rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#17749fff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: page === totalPages ? 0.5 : 1
      }}>
        Next
      </button>
    </div>
  </div>
);

}
export default Table