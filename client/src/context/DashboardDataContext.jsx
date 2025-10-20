import React, {createContext, useState, useContext} from "react";

const DashboardDataContext = createContext();

export function DashboardDataProvider({children}){
    const [dashboardData, setDashboardData] = useState(
{
        // DASHBOARD GENERAL
        unsuccessfulCalls: 0, // poutcome != success
        successfulCalls: 0, // poutcome = success
        ageDistribution: [
            /* name -> Rango de edad, Ej 12-18 
            lineValue = value -> cantidad de registros entre ese rango de edad
            El linevalue es para que la línea siga la distribución de las barras*/ 
            {name: "", lineValue: 0, value: 0} 
        ],
        maritalStatus: [
            /* name -> estado Civi, Ej Soltero
            value -> cantidad de registros en dicho estado civil */
            {name: "Casado", value: 0}
        ],
        ocupation: [
            /*name -> nombre de la ocupación
            value -> cantidad de llamadas de dicha ocupación*/
            {name:"", value: 0}
        ],
        consumerCredital: [
            /*
            group -> Agrupación de las barras (Hipoteca = housing, Préstamo = loan, Moroso = default)
            Si -> campo = yes
            No -> campo = no
            Desconocido -> campo = uknown  
            */
            {group: "Hipoteca", Si: 0, No: 0, Desconocido: 0},
            {group: "Préstamo", Si: 0, No: 0, Desconocido: 0},
            {group: "Moroso", Si: 0, No: 0, Desconocido: 0}
        ],
        educationCR: [
            /* group -> Educación
                Primaria4to -> tasa de conversión de registros donde education = basic.4y
                Primaria6to -> tasa de conversión de registros donde education = basic.6y
                Primaria9no -> tasa de conversión de registros donde education = basic.9y
                Colegio -> tasa de conversión de registros donde education = high.school
                CursoProfesional -> tasa de conversión de registros donde education = professional.course
                GradoUniversitario -> tasa de conversión de registros donde education = university.degree 
                Desconocido -> tasa de conversión de registros donde education = uknown
            */
            {group: "Educación", 
                Primaria4to: 0, 
                Primaria6to: 0, 
                Primaria9no: 0,
                Colegio: 0,
                CursoProfesional: 0,
                GradoUniversitario: 0,
                Desconocido: 0
                },
        ],
        //DASHBOARD DE LLAMADAS
        contactType: [
            /* group -> Contacto
            Celular -> Cantidad de registros con contact = celular
            Telefono -> Cantidad de registros con contact = telephone
             */
            {group: "Contacto", 
                Celular: 0, 
                Telefono: 0}
        ],
        callsPerMonth: [
            /* name -> Mes, Ej: Dic
            lineValue -> Cantidad de registros en ese mes
            */
            { name: "", lineValue: 0},
        ],
        callAvgDuration: [
            /* group -> Resultado
            Aceptadas -> Duración promedio de los registros donde y = yes
            Rechazadas -> Duración promedio de los registros donde y = no*/
            {group: "Resultado",
                Aceptadas: 0,
                Rechazadas: 0
            }
        ],
        weekDayCR: [
            /*name -> día de la semana, Ej: Mon
            value -> Tasa de Conversión de los registros en ese día de la semana*/
            { name: "Mon", value: 0 },
            { name: "Tue", value: 0 },
            { name: "Wed", value: 0 },
            { name: "Thu", value: 0 },
            { name: "Fri", value: 0 },
        ],
        callOutcome: [
            /* name -> Resultado
            Exito -> Cantidad de llamadas poutcome = success
            Fallida -> Cantidad de llamadas poutcome = failure
            Ninguno -> Cantidad de llamadas poutcome = nonexistant
            */
            {name: "Resultado", Ninguno: 0, Exito: 0, Fallida: 0}
        ],
        campaignCalls: [
            /* name -> Campaña
            lineValue -> Cantidad de llamadas de dicha campaña
             */
            { name: "", lineValue: 0},
        ],
        // DASHBOARD ADICIONAL
        monthlyVar: [
            /*date -> iniciales del mes en minúscula, Ej: feb
            varRate -> promedio de dicho mes del emp.var.rate
            consPrice -> promedio de dicho mes del cons.conf.idx
            consConf -> promedio de dicho mes del cons.conf.idx
            */
            { date: "", varRate: 0, consPrice: 0, consConf: 0 },
        ],
        employeeNumberCR: [
            /* x -> número de empleados (nr.employed)
            y -> tasa de conversión con ese número de empleados
            name -> Point*/
            { x: 0, y: 0, name: "Point" },
        ],
        prevCR: [
            /* name -> Cantidad de días previos (previous)
            value -> Cantidad de registros en ese número de días previos
            lineValue -> Tasa de conversión en ese número de días previos
            */
            {name: "", value: 0, lineValue: 0}
        ],
        callSubscription: [
            /* name -> suscrito o no (Si/No)
            value -> cantidad de registros suscritos (y = yes/no)*/
            { name: "Si", value: 0},
            { name: "No", value: 0}
        ],
        monthlyEur: [
            /* date -> iniciales del mes en minúscula, Ej: feb
            euribor -> euribor promedio en el mes
            */
            {date: "", euribor: 0}
        ],
        // DASHBOARD KPIs
        // VER ANEXO C de SRS PARA ESPECIFICACION DE KPIs
        cr: 0, // Tasa de conversion general
        totalCalls: 0, // total de registros
        callAvg: 0, // Duración promedio de todas las llamadas
        contactSuccess: [
            /*group -> Contacto
            Celular -> tasa de exito para celular 
            Telephone -> tasa de exito para teléfono*/
            {group: "Contacto", 
                Celular: 0, 
                Telefono: 0},
        ],
        ageConversionRate: [
            /*name -> Rango de edad 
            value -> CR de edad*/
            { name: "", value: 0},
        ],
        prevImpact: [
            /*group -> Resultado
            Exito -> conversion condicionada a poutcome = success
            Fallido -> conversion condicionada a poutcome = failure
            Ninguno -> conversion condicionada a poutcome = nonexistant
            */
            {group: "Resultado", Exito: 1, Fallido: 2, Ninguno: 0}
        ],
        campaignEfficiency: [
            /*date -> Iniciales minúsculas del mes, Ej: aug
            lo que sigue deben ser una key para cada una de las campañas con el valor KPI correspondiente
            Ej:     { date: "ene", C1: 0.05, C2: 0.03, C3: 0.02 , ...},
                    { date: "feb", C1: 0.06, C2: 0.035, C3: 0.025, ...},
            */
        ]
    }
);
    return (
        <DashboardDataContext.Provider value={{ dashboardData, setDashboardData }}>
            {children}
        </DashboardDataContext.Provider>
    );
}
export {DashboardDataContext};