import React, { useEffect, useState } from "react"; //controlan cambios y recarga de tabla

function Table() {

  //estado actual
  const [documents, setDocuments] = useState([]);   // guarda los datos que vienen de mongodb y los actualiza
  const [page, setPage] = useState(1);  //determina la pagina actual y la cambia
  const [totalPages, setTotalPages] = useState(1); //numero de paginas calculada a partir de la cantidad de documentos
  const [totalDocuments, setTotalDocuments] = useState(1);
  const [todosDocuments, setTodosDocuments] =  useState([]);
  const limit = 100;  //cantidad de filas por pagina

  //ordenamiento
  const [sortColumn, setSortColumn] = useState(null); // columna a ordenar
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' o 'desc'
  

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
    setTodosDocuments(mockDocs);
    setTotalDocuments(mockDocs.length);
    setTotalPages(Math.ceil(mockDocs.length / limit));
}, []);




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


// ordenar documentos segun columna seleccionada
const sortedDocuments = React.useMemo(() => {  //recuerda Valorores para no recalcular al cambiar pagina
  if (!sortColumn) return todosDocuments;  //si no hay una columna seleccionada, sigue igual

  return [...todosDocuments].sort((a, b) => {   //copia los documents con ... y les hace sort
    const aValor = a[sortColumn]; //recupera valores de columna seleccionada
    const bValor = b[sortColumn];

    // Si son números
    if (!isNaN(aValor) && !isNaN(bValor)) {
      return sortDirection === "asc" ? aValor - bValor : bValor - aValor;  //si lo elegido es asc de menor a mayor, sino mayor a menor
    }

    // Si son strings
    if (typeof aValor === "string" && typeof bValor === "string") { 
      return sortDirection === "asc" 
        ? aValor.localeCompare(bValor)  //si es asc compara alfabeticamente de menor a mayor
        : bValor.localeCompare(aValor); //sino, de mayor a menor
    }

    return 0; // si nada funciona
  });
}, [todosDocuments, sortColumn, sortDirection]); //sortedDocuments es el nuevo documents segun estos parametros



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




//mensajito para evitar confusion
const sortMessage = sortColumn 
  ? `Orden: ${sortColumn} ${sortDirection === "asc" ? "↑" : "↓"}`
  : "Sin orden";


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