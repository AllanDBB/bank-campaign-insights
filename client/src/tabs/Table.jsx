import React, { useEffect, useState } from "react"; //controlan cambios y recarga de tabla

function Table() {

  //estado actual
  const [page, setPage] = useState(1);  //determina la pagina actual y la cambia
  const [totalPages, setTotalPages] = useState(1); //numero de paginas calculada a partir de la cantidad de documentos
  const [totalDocuments, setTotalDocuments] = useState(1);
  const [todosDocuments, setTodosDocuments] =  useState([]);
  const limit = 100;  //cantidad de filas por pagina

  //ordenamiento
  const [sortColumn, setSortColumn] = useState(null); // columna a ordenar
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' o 'desc'
  

useEffect(() => {
  fetchAllDocuments();
}, []);




//se extraen los datos del backend
const fetchAllDocuments = async () => {
  try {
    // Traemos todos los documentos para poder ordenarlos localmente
    const res = await fetch(`/documents?limit=100000`, { 
      headers: { "Content-Type": "application/json" } 
    });
    const data = await res.json();

    if (data.success) {
      setTodosDocuments(data.data);                       // guardar documentos
      setTotalDocuments(data.pagination.total);           // total de documentos
      setTotalPages(Math.ceil(data.pagination.total / limit)); // total páginas
    } else {
      console.error("Error fetching documents:", data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};



// ordenar documentos segun columna seleccionada
// ordenar documentos según columna seleccionada
const sortedDocuments = React.useMemo(() => {
  if (!sortColumn) return todosDocuments;

  // Mapas de orden para columnas especiales
  const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return [...todosDocuments].sort((a, b) => {
    const aValor = a[sortColumn];
    const bValor = b[sortColumn];

    // meses-
    if (sortColumn === "month") {
      const aIndex = monthOrder.indexOf(aValor.toLowerCase());
      const bIndex = monthOrder.indexOf(bValor.toLowerCase());
      if (aIndex === -1 || bIndex === -1) return 0; // si no coincide con un mes conocido, no cambia
      return sortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
    }

    // dias
    if (sortColumn === "day_of_week") {
      const aIndex = dayOrder.indexOf(aValor.toLowerCase());
      const bIndex = dayOrder.indexOf(bValor.toLowerCase());
      if (aIndex === -1 || bIndex === -1) return 0;
      return sortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
    }

    // numero
    if (!isNaN(aValor) && !isNaN(bValor)) {
      return sortDirection === "asc" ? aValor - bValor : bValor - aValor;
    }

    // alfabetico
    if (typeof aValor === "string" && typeof bValor === "string") {
      return sortDirection === "asc"
        ? aValor.localeCompare(bValor)
        : bValor.localeCompare(aValor);
    }

    return 0;
  });
}, [todosDocuments, sortColumn, sortDirection]);



// Paginación sobre el sortedDocuments
const paginatedDocuments = React.useMemo(() => {
  const start = (page - 1) * limit;
  const end = page * limit;
  return sortedDocuments.slice(start, end);
}, [sortedDocuments, page]);



//se hace sort cuando se hace click a la columna para ordenar
const controlSort = (column) => {
  if (sortColumn === column) {
    if (sortDirection === "asc") {
      setSortDirection("desc");   // si ya esta ascendente, y se hace click, cambiar a descendente
    } else if (sortDirection === "desc") {
      setSortColumn(null);  // si ya esta descendente, y hace click, se quita el ordenamiento
      setSortDirection(null);
    }
  } else {
    setSortColumn(column);
    setSortDirection("asc");  // si no tiene orden y hace click, se pone ascendente
};}



//convertir a csv (solo agregar comas y dar formato)
const exportToCSV = () => {
  if (!sortedDocuments || sortedDocuments.length === 0) return;
  const headers = Object.keys(sortedDocuments[0]); // Obtener titulos (columnas)
  const rows = sortedDocuments.map(doc =>
    headers.map(header => `"${doc[header]}"`).join(",") // Construir filas, agregando comas entre elementos en el orden de titulos
  );
  const csvContent = [headers.join(","), ...rows].join("\n");   // Crear el contenido, primero titulos, cambio de linea, luego filas

  // Crear un enlace para descargar el archivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }); //archivo "virtual" en memoria con Blob en formato csv
  const url = URL.createObjectURL(blob);  //se genera un link temporal
  //lo descarga
  const link = document.createElement("a");
  link.href = url; //referencia es la nueva url creada del blob
  link.setAttribute("download", "tabla_ordenada.csv"); //nombre
  document.body.appendChild(link);  //para evitar errores de navegador
  link.click(); //simula que el usuario le dio click para simular que lo mando a guardar en el disco
  document.body.removeChild(link);  //limpia navegador
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
      <button onClick={exportToCSV} 
      style={{
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
        <span style={{fontSize: "1.5rem"}}>{totalDocuments}</span>
        <span style={{fontSize: "0.9rem"}}>REGISTROS</span>
      </div>
    </div>



    {/* Paginación + mensajito */}
    <div style={{
    position: "relative",      
    display: "flex",
    justifyContent: "center",    
    alignItems: "center",
    marginTop: "1.5rem",
    padding: "0 4.5rem"          
    }}>
    {/* Botones de cambio de página */}
    <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        paddingTop: "3.5rem"
    }}>
        <button onClick={handlePrev} disabled={page === 1} style={{
        padding: "0.5rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#17749fff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: page === 1 ? 0.5 : 1
        }}>Back</button>

        <div style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        backgroundColor: "#44A1B4",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "1rem"
        }}>{page}</div>

        <span style={{color: "white", fontSize: "1rem"}}>/ {totalPages}</span>

        <button onClick={handleNext} disabled={page === totalPages} style={{
        padding: "0.5rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#17749fff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: page === totalPages ? 0.5 : 1
        }}>Next</button>
    </div>

    {/* Mensajito */}
    <div style={{
        position: "absolute",
        right: 0,
        display: "inline-block",
        backgroundColor: "#1f1f1f",
        color: "#44A1B4",
        border: "1px solid #44A1B4",
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        textAlign: "center",
        fontWeight: "bold",
        marginRight: "4.8rem",
    }}>
        <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>Orden</div>
        <div style={{ fontSize: "1rem" }}>
            {sortColumn ? (
                <>
                {sortColumn} <span style={{ fontSize: "1.5rem" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
                </> ) : ( "Ninguno" )}
        </div>
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
            {todosDocuments[0] && Object.keys(todosDocuments[0]).map((key) => (
              <th onClick={() => controlSort(key)} key={key} style={{border: "1px white", padding: "0.75rem 1.5rem", fontWeight: "500", minWidth: "110px", cursor: "pointer"}}>
                {key}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas */}
        <tbody>
          {/* Recorre los documentos completos obtenidos del backend */}
          {paginatedDocuments.map((doc, index) => (
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