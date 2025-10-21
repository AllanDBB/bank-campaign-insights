import DocumentDAO from '../daos/DocumentDAO.js';
import Document from '../models/Document.js';

class MetricsService {
  constructor() {
    this.documentDAO = new DocumentDAO();
  }

  async calculateDashboardMetrics(userId, filters = {}) {
    try {
      // Build query based on filters
      const query = this.buildFilterQuery(userId, filters);

      // Fetch all documents that match the filters
      const documents = await Document.find(query).lean();

      if (documents.length === 0) {
        return this.getEmptyMetrics();
      }

      // Calculate all metrics
      const metrics = {
        // DASHBOARD GENERAL
        unsuccessfulCalls: this.calculateUnsuccessfulCalls(documents),
        successfulCalls: this.calculateSuccessfulCalls(documents),
        ageDistribution: this.calculateAgeDistribution(documents),
        maritalStatus: this.calculateMaritalStatus(documents),
        ocupation: this.calculateOcupation(documents),
        consumerCredital: this.calculateConsumerCredital(documents),
        educationCR: this.calculateEducationCR(documents),

        // DASHBOARD DE LLAMADAS
        contactType: this.calculateContactType(documents),
        callsPerMonth: this.calculateCallsPerMonth(documents),
        callAvgDuration: this.calculateCallAvgDuration(documents),
        weekDayCR: this.calculateWeekDayCR(documents),
        callOutcome: this.calculateCallOutcome(documents),
        campaignCalls: this.calculateCampaignCalls(documents),

        // DASHBOARD ADICIONAL
        monthlyVar: this.calculateMonthlyVar(documents),
        employeeNumberCR: this.calculateEmployeeNumberCR(documents),
        prevCR: this.calculatePrevCR(documents),
        callSubscription: this.calculateCallSubscription(documents),
        monthlyEur: this.calculateMonthlyEur(documents),

        // DASHBOARD KPIs
        cr: this.calculateConversionRate(documents),
        totalCalls: documents.length,
        callAvg: this.calculateAverageCallDuration(documents),
        contactSuccess: this.calculateContactSuccess(documents),
        ageConversionRate: this.calculateAgeConversionRate(documents),
        prevImpact: this.calculatePrevImpact(documents),
        campaignEfficiency: this.calculateCampaignEfficiency(documents)
      };

      return {
        success: true,
        metrics
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  buildFilterQuery(userId, filters) {
    const query = { userId };

    // Range filters
    const rangeFields = [
      'age', 'contactDurationSeconds', 'numberOfContacts',
      'daysSinceLastContact', 'previousContactsCount',
      'employmentVariationRate', 'consumerPriceIndex',
      'consumerConfidenceIndex', 'euriborThreeMonthRate', 'numberOfEmployees'
    ];

    rangeFields.forEach(field => {
      const minKey = `${field}_min`;
      const maxKey = `${field}_max`;

      if (filters[minKey] !== undefined || filters[maxKey] !== undefined) {
        query[field] = {};
        if (filters[minKey] !== undefined) query[field].$gte = Number(filters[minKey]);
        if (filters[maxKey] !== undefined) query[field].$lte = Number(filters[maxKey]);
      }
    });

    // Multiple choice filters
    const multipleFields = [
      'job', 'marital', 'education', 'hasCreditDefault',
      'hasHousingLoan', 'hasPersonalLoan', 'contactType',
      'contactMonth', 'contactDayOfWeek', 'previousCampaignOutcome',
      'subscribedTermDeposit'
    ];

    multipleFields.forEach(field => {
      if (filters[field]) {
        const values = Array.isArray(filters[field])
          ? filters[field]
          : filters[field].split(',');
        query[field] = { $in: values };
      }
    });

    return query;
  }

  // DASHBOARD GENERAL CALCULATIONS

  calculateUnsuccessfulCalls(documents) {
    return documents.filter(doc => 
      doc.previousCampaignOutcome && doc.previousCampaignOutcome !== 'success'
    ).length;
  }

  calculateSuccessfulCalls(documents) {
    return documents.filter(doc => 
      doc.previousCampaignOutcome === 'success'
    ).length;
  }

  calculateAgeDistribution(documents) {
    const ranges = [
      { name: '18-25', min: 18, max: 25 },
      { name: '26-35', min: 26, max: 35 },
      { name: '36-45', min: 36, max: 45 },
      { name: '46-55', min: 46, max: 55 },
      { name: '56-65', min: 56, max: 65 },
      { name: '66+', min: 66, max: 150 }
    ];

    return ranges.map(range => {
      const count = documents.filter(doc => 
        doc.age >= range.min && doc.age <= range.max
      ).length;
      return { name: range.name, value: count, lineValue: count };
    });
  }

  calculateMaritalStatus(documents) {
    const statusMap = {};
    documents.forEach(doc => {
      const status = doc.marital || 'unknown';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }

  calculateOcupation(documents) {
    const ocupationMap = {};
    documents.forEach(doc => {
      const job = doc.job || 'unknown';
      ocupationMap[job] = (ocupationMap[job] || 0) + 1;
    });

    return Object.entries(ocupationMap).map(([name, value]) => ({ name, value }));
  }

  calculateConsumerCredital(documents) {
    const countByField = (field, value) => 
      documents.filter(doc => doc[field] === value).length;

    return [
      {
        group: 'Hipoteca',
        Si: countByField('hasHousingLoan', 'yes'),
        No: countByField('hasHousingLoan', 'no'),
        Desconocido: countByField('hasHousingLoan', 'unknown')
      },
      {
        group: 'Préstamo',
        Si: countByField('hasPersonalLoan', 'yes'),
        No: countByField('hasPersonalLoan', 'no'),
        Desconocido: countByField('hasPersonalLoan', 'unknown')
      },
      {
        group: 'Moroso',
        Si: countByField('hasCreditDefault', 'yes'),
        No: countByField('hasCreditDefault', 'no'),
        Desconocido: countByField('hasCreditDefault', 'unknown')
      }
    ];
  }

  calculateEducationCR(documents) {
    const calculateCR = (education) => {
      const filtered = documents.filter(doc => doc.education === education);
      if (filtered.length === 0) return 0;
      const converted = filtered.filter(doc => doc.subscribedTermDeposit === 'yes').length;
      return (converted / filtered.length) * 100;
    };

    return [{
      group: 'Educación',
      Primaria4to: calculateCR('basic.4y'),
      Primaria6to: calculateCR('basic.6y'),
      Primaria9no: calculateCR('basic.9y'),
      Colegio: calculateCR('high.school'),
      CursoProfesional: calculateCR('professional.course'),
      GradoUniversitario: calculateCR('university.degree'),
      Desconocido: calculateCR('unknown')
    }];
  }

  // DASHBOARD DE LLAMADAS CALCULATIONS

  calculateContactType(documents) {
    const cellular = documents.filter(doc => doc.contactType === 'cellular').length;
    const telephone = documents.filter(doc => doc.contactType === 'telephone').length;

    return [{
      group: 'Contacto',
      Celular: cellular,
      Telefono: telephone
    }];
  }

  calculateCallsPerMonth(documents) {
    const monthMap = {};
    const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    documents.forEach(doc => {
      const month = doc.contactMonth || 'unknown';
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    return monthOrder
      .filter(month => monthMap[month])
      .map(month => ({
        name: month,
        lineValue: monthMap[month]
      }));
  }

  calculateCallAvgDuration(documents) {
    const accepted = documents.filter(doc => doc.subscribedTermDeposit === 'yes');
    const rejected = documents.filter(doc => doc.subscribedTermDeposit === 'no');

    const avgAccepted = accepted.length > 0
      ? accepted.reduce((sum, doc) => sum + (doc.contactDurationSeconds || 0), 0) / accepted.length
      : 0;

    const avgRejected = rejected.length > 0
      ? rejected.reduce((sum, doc) => sum + (doc.contactDurationSeconds || 0), 0) / rejected.length
      : 0;

    return [{
      group: 'Resultado',
      Aceptadas: Math.round(avgAccepted),
      Rechazadas: Math.round(avgRejected)
    }];
  }

  calculateWeekDayCR(documents) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    
    return days.map(day => {
      const dayDocs = documents.filter(doc => doc.contactDayOfWeek === day);
      if (dayDocs.length === 0) return { name: day, value: 0 };
      
      const converted = dayDocs.filter(doc => doc.subscribedTermDeposit === 'yes').length;
      return {
        name: day,
        value: (converted / dayDocs.length) * 100
      };
    });
  }

  calculateCallOutcome(documents) {
    const success = documents.filter(doc => doc.previousCampaignOutcome === 'success').length;
    const failure = documents.filter(doc => doc.previousCampaignOutcome === 'failure').length;
    const nonexistent = documents.filter(doc => doc.previousCampaignOutcome === 'nonexistent').length;

    return [{
      name: 'Resultado',
      Exito: success,
      Fallida: failure,
      Ninguno: nonexistent
    }];
  }

  calculateCampaignCalls(documents) {
    const campaignMap = {};
    
    documents.forEach(doc => {
      const campaign = doc.numberOfContacts || 0;
      campaignMap[campaign] = (campaignMap[campaign] || 0) + 1;
    });

    return Object.entries(campaignMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([name, lineValue]) => ({ name: `C${name}`, lineValue }));
  }

  // DASHBOARD ADICIONAL CALCULATIONS

  calculateMonthlyVar(documents) {
    const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthlyData = {};

    documents.forEach(doc => {
      const month = doc.contactMonth;
      if (!month) return;

      if (!monthlyData[month]) {
        monthlyData[month] = {
          varRate: [],
          consPrice: [],
          consConf: []
        };
      }

      if (doc.employmentVariationRate !== undefined) {
        monthlyData[month].varRate.push(doc.employmentVariationRate);
      }
      if (doc.consumerPriceIndex !== undefined) {
        monthlyData[month].consPrice.push(doc.consumerPriceIndex);
      }
      if (doc.consumerConfidenceIndex !== undefined) {
        monthlyData[month].consConf.push(doc.consumerConfidenceIndex);
      }
    });

    return monthOrder
      .filter(month => monthlyData[month])
      .map(month => ({
        date: month,
        varRate: this.average(monthlyData[month].varRate),
        consPrice: this.average(monthlyData[month].consPrice),
        consConf: this.average(monthlyData[month].consConf)
      }));
  }

  calculateEmployeeNumberCR(documents) {
    const employeeMap = {};

    documents.forEach(doc => {
      const employees = doc.numberOfEmployees;
      if (!employees) return;

      if (!employeeMap[employees]) {
        employeeMap[employees] = { total: 0, converted: 0 };
      }

      employeeMap[employees].total++;
      if (doc.subscribedTermDeposit === 'yes') {
        employeeMap[employees].converted++;
      }
    });

    return Object.entries(employeeMap).map(([employees, data]) => ({
      x: Number(employees),
      y: (data.converted / data.total) * 100,
      name: 'Point'
    }));
  }

  calculatePrevCR(documents) {
    const prevMap = {};

    documents.forEach(doc => {
      const prev = doc.previousContactsCount || 0;
      if (!prevMap[prev]) {
        prevMap[prev] = { total: 0, converted: 0 };
      }

      prevMap[prev].total++;
      if (doc.subscribedTermDeposit === 'yes') {
        prevMap[prev].converted++;
      }
    });

    return Object.entries(prevMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([prev, data]) => ({
        name: prev,
        value: data.total,
        lineValue: (data.converted / data.total) * 100
      }));
  }

  calculateCallSubscription(documents) {
    const yes = documents.filter(doc => doc.subscribedTermDeposit === 'yes').length;
    const no = documents.filter(doc => doc.subscribedTermDeposit === 'no').length;

    return [
      { name: 'Si', value: yes },
      { name: 'No', value: no }
    ];
  }

  calculateMonthlyEur(documents) {
    const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthlyData = {};

    documents.forEach(doc => {
      const month = doc.contactMonth;
      if (!month || doc.euriborThreeMonthRate === undefined) return;

      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(doc.euriborThreeMonthRate);
    });

    return monthOrder
      .filter(month => monthlyData[month])
      .map(month => ({
        date: month,
        euribor: this.average(monthlyData[month])
      }));
  }

  // DASHBOARD KPIs CALCULATIONS

  calculateConversionRate(documents) {
    if (documents.length === 0) return 0;
    const converted = documents.filter(doc => doc.subscribedTermDeposit === 'yes').length;
    return (converted / documents.length) * 100;
  }

  calculateAverageCallDuration(documents) {
    if (documents.length === 0) return 0;
    const total = documents.reduce((sum, doc) => sum + (doc.contactDurationSeconds || 0), 0);
    return Math.round(total / documents.length);
  }

  calculateContactSuccess(documents) {
    const calculateSuccessRate = (contactType) => {
      const filtered = documents.filter(doc => doc.contactType === contactType);
      if (filtered.length === 0) return 0;
      const converted = filtered.filter(doc => doc.subscribedTermDeposit === 'yes').length;
      return (converted / filtered.length) * 100;
    };

    return [{
      group: 'Contacto',
      Celular: calculateSuccessRate('cellular'),
      Telefono: calculateSuccessRate('telephone')
    }];
  }

  calculateAgeConversionRate(documents) {
    const ranges = [
      { name: '18-25', min: 18, max: 25 },
      { name: '26-35', min: 26, max: 35 },
      { name: '36-45', min: 36, max: 45 },
      { name: '46-55', min: 46, max: 55 },
      { name: '56-65', min: 56, max: 65 },
      { name: '66+', min: 66, max: 150 }
    ];

    return ranges.map(range => {
      const filtered = documents.filter(doc => 
        doc.age >= range.min && doc.age <= range.max
      );
      if (filtered.length === 0) return { name: range.name, value: 0 };
      
      const converted = filtered.filter(doc => doc.subscribedTermDeposit === 'yes').length;
      return {
        name: range.name,
        value: (converted / filtered.length) * 100
      };
    });
  }

  calculatePrevImpact(documents) {
    const calculateImpact = (outcome) => {
      const filtered = documents.filter(doc => doc.previousCampaignOutcome === outcome);
      if (filtered.length === 0) return 0;
      const converted = filtered.filter(doc => doc.subscribedTermDeposit === 'yes').length;
      return (converted / filtered.length) * 100;
    };

    return [{
      name: 'Resultado',
      Exito: calculateImpact('success'),
      Fallido: calculateImpact('failure'),
      Ninguno: calculateImpact('nonexistent')
    }];
  }

  calculateCampaignEfficiency(documents) {
    const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthCampaignData = {};

    documents.forEach(doc => {
      const month = doc.contactMonth;
      const campaign = `C${doc.numberOfContacts || 0}`;
      
      if (!month) return;

      if (!monthCampaignData[month]) {
        monthCampaignData[month] = {};
      }

      if (!monthCampaignData[month][campaign]) {
        monthCampaignData[month][campaign] = { total: 0, converted: 0 };
      }

      monthCampaignData[month][campaign].total++;
      if (doc.subscribedTermDeposit === 'yes') {
        monthCampaignData[month][campaign].converted++;
      }
    });

    return monthOrder
      .filter(month => monthCampaignData[month])
      .map(month => {
        const result = { date: month };
        
        Object.entries(monthCampaignData[month]).forEach(([campaign, data]) => {
          result[campaign] = (data.converted / data.total) * 100;
        });

        return result;
      });
  }

  // UTILITY METHODS

  average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  getEmptyMetrics() {
    return {
      success: true,
      metrics: {
        unsuccessfulCalls: 0,
        successfulCalls: 0,
        ageDistribution: [],
        maritalStatus: [],
        ocupation: [],
        consumerCredital: [
          { group: 'Hipoteca', Si: 0, No: 0, Desconocido: 0 },
          { group: 'Préstamo', Si: 0, No: 0, Desconocido: 0 },
          { group: 'Moroso', Si: 0, No: 0, Desconocido: 0 }
        ],
        educationCR: [{
          group: 'Educación',
          Primaria4to: 0,
          Primaria6to: 0,
          Primaria9no: 0,
          Colegio: 0,
          CursoProfesional: 0,
          GradoUniversitario: 0,
          Desconocido: 0
        }],
        contactType: [{ group: 'Contacto', Celular: 0, Telefono: 0 }],
        callsPerMonth: [],
        callAvgDuration: [{ group: 'Resultado', Aceptadas: 0, Rechazadas: 0 }],
        weekDayCR: [
          { name: 'mon', value: 0 },
          { name: 'tue', value: 0 },
          { name: 'wed', value: 0 },
          { name: 'thu', value: 0 },
          { name: 'fri', value: 0 }
        ],
        callOutcome: [{ name: 'Resultado', Exito: 0, Fallida: 0, Ninguno: 0 }],
        campaignCalls: [],
        monthlyVar: [],
        employeeNumberCR: [],
        prevCR: [],
        callSubscription: [{ name: 'Si', value: 0 }, { name: 'No', value: 0 }],
        monthlyEur: [],
        cr: 0,
        totalCalls: 0,
        callAvg: 0,
        contactSuccess: [{ group: 'Contacto', Celular: 0, Telefono: 0 }],
        ageConversionRate: [],
        prevImpact: [{ name: 'Resultado', Exito: 0, Fallido: 0, Ninguno: 0 }],
        campaignEfficiency: []
      }
    };
  }
}

export default MetricsService;
