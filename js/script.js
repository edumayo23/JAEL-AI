// script2.js

const UPDATE_INTERVAL = 2000; 
let currentConversions = []; 

// =================================================================
// 1. LÓGICA DEL SIDEBAR (RESPONSIVE)
// =================================================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// =================================================================
// 2. FUNCIONES DE RENDERIZADO DEL DASHBOARD
// =================================================================

function renderKpis(kpis) {
    const container = document.getElementById('kpi-cards-container');
    container.innerHTML = '';
    
    kpis.forEach(kpi => {
        const trendText = kpi.trend === 'up' ? 'Positiva' : 'Negativa';
        const trendIcon = kpi.trend === 'up' ? 'arrow_drop_up' : 'arrow_drop_down';
        const trendColor = kpi.trend === 'up' ? 'text-green-500' : 'text-red-500';

        const cardHtml = `
            <div class="bg-[--color-card] p-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 border border-gray-700">
                <div class="flex justify-between items-start">
                    <span class="material-icons-outlined text-3xl text-[--color-primary]">${kpi.icon}</span>
                </div>
                <div class="text-4xl font-extrabold mt-3">${kpi.value}</div>
                <div class="text-sm text-gray-400 mt-1 mb-2">${kpi.title}</div>
                <span class="flex items-center text-xs font-medium ${trendColor}">
                    <span class="material-icons-outlined text-lg">${trendIcon}</span> 
                    Tendencia ${trendText}
                </span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function populateConversionsTable(conversions) {
    const tbody = document.getElementById('transactions-body');
    if (!tbody) return; 
    tbody.innerHTML = ''; 

    conversions.forEach(conv => {
        const row = tbody.insertRow();
        row.className = 'hover:bg-gray-700 transition duration-150';

        let badgeClass;
        if (conv.metric.includes('Venta') || conv.metric.includes('Premium')) {
            badgeClass = 'bg-green-800 text-green-300'; 
        } else if (conv.metric.includes('Descarga') || conv.metric.includes('Demo')) {
            badgeClass = 'bg-yellow-800 text-yellow-300';
        } else {
            badgeClass = 'bg-gray-800 text-gray-400';
        }

        row.insertCell(0).className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-white';
        row.cells[0].textContent = conv.id;
        
        row.insertCell(1).className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-300';
        row.cells[1].textContent = conv.campaign;
        
        row.insertCell(2).className = 'px-6 py-4 whitespace-nowrap text-sm text-red-400 font-medium';
        row.cells[2].textContent = conv.cost;
        
        const metricCell = row.insertCell(3);
        metricCell.className = 'px-6 py-4 whitespace-nowrap text-sm';
        metricCell.innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}">${conv.metric}</span>`;

        row.insertCell(4).className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        row.cells[4].textContent = conv.date;
    });
}

function generateNewConversion(baseConversions) {
    const statuses = ["Venta Completada", "Suscripción Premium", "Descarga de Ebook", "Registro de Demo"];
    const campaigns = ["Búsqueda Q4 Marca", "Retargeting Top 5%", "Redes Sociales (Video)", "Display Prospección"];
    
    const lastId = baseConversions.length > 0 ? baseConversions[0].id : 'Conv-9900';
    const lastNum = parseInt(lastId.replace('Conv-', ''), 10);
    const nextNum = lastNum + 1;
    
    const newCost = (Math.random() * 8 + 5).toFixed(2);
    
    const newConversion = {
        id: `Conv-${String(nextNum).padStart(4, '0')}`,
        campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
        cost: newCost + ' $',
        metric: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date().toISOString().split('T')[0]
    };
    
    return [newConversion, ...baseConversions].slice(0, 8);
}

function setupDynamicConversions() {
    populateConversionsTable(currentConversions);
    
    setInterval(() => {
        currentConversions = generateNewConversion(currentConversions);
        populateConversionsTable(currentConversions);
    }, UPDATE_INTERVAL);
}

// =================================================================
// 3. FUNCIONES DE GRÁFICOS (Chart.js)
// =================================================================

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { labels: { color: '#94a3b8' } },
        tooltip: { backgroundColor: 'rgba(30, 39, 53, 0.9)', titleColor: '#fff', bodyColor: '#fff' }
    },
    scales: {
        y: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            title: { display: true, color: '#94a3b8' }
        },
        x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            title: { display: true, color: '#94a3b8' }
        }
    }
};

function renderCpaChart(chartData) {
    const ctx = document.getElementById('cpaChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'CPA ($)',
                data: chartData.data,
                borderColor: '#3b82f6', 
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...commonChartOptions,
            scales: {
                ...commonChartOptions.scales,
                y: { ...commonChartOptions.scales.y, title: { text: 'CPA (USD)' }, beginAtZero: false, min: 7 }
            }
        }
    });
}

function renderBudgetChart(chartData) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    
    // Generar la leyenda HTML manualmente
    const legendContainer = document.getElementById('budget-legend-container');
    legendContainer.innerHTML = ''; // Limpiar el contenedor

    chartData.labels.forEach((label, index) => {
        const color = chartData.colors[index];
        const dataValue = chartData.data[index];

        const legendItem = document.createElement('div');
        legendItem.className = 'flex justify-between items-center';
        legendItem.innerHTML = `
            <div class="flex items-center">
                <span style="background-color: ${color};" class="w-3 h-3 rounded-full mr-2 inline-block"></span>
                <span class="text-gray-300">${label}</span>
            </div>
            <span class="font-bold text-lg">${dataValue}%</span>
        `;
        legendContainer.appendChild(legendItem);
    });

    // Renderizar el gráfico de dona SIN leyenda
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Distribución %',
                data: chartData.data,
                backgroundColor: chartData.colors,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Cambiado a true para que ocupe el espacio disponible en su div
            cutout: '60%', 
            layout: {
                // Quitamos todo padding forzado
                padding: 0
            },
            plugins: {
                // ✨ DESHABILITAR LA LEYENDA NATIVA
                legend: { 
                    display: false // Esto es clave: ocultamos la leyenda de Chart.js
                },
                title: { display: false }
            }
        }
    });
}

function renderCtrChart(chartData) {
    const ctx = document.getElementById('ctrChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'CTR (%)',
                data: chartData.data,
                backgroundColor: '#10b981',
                hoverBackgroundColor: '#059669',
            }]
        },
        options: {
            ...commonChartOptions,
            scales: {
                ...commonChartOptions.scales,
                y: { ...commonChartOptions.scales.y, beginAtZero: true, title: { text: 'Tasa de Clic (%)' } }
            }
        }
    });
}

function renderHistoryChart(chartData) {
    const ctx = document.getElementById('historyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May"],
            datasets: [
                {
                    label: 'Inversión (K USD)',
                    data: chartData.investment.map(i => i / 1000), 
                    borderColor: '#ef4444', 
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    yAxisID: 'y',
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'Conversiones (Unidades)',
                    data: chartData.conversion,
                    borderColor: '#3b82f6', 
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    yAxisID: 'y1',
                    tension: 0.2,
                    fill: false
                }
            ]
        },
        options: {
            ...commonChartOptions,
            interaction: { mode: 'index', intersect: false },
            scales: {
                ...commonChartOptions.scales,
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { text: 'Inversión (K USD)', color: '#ef4444' },
                    ticks: { color: '#ef4444' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false, color: 'rgba(255, 255, 255, 0.1)' }, 
                    title: { text: 'Conversiones (Unidades)', color: '#3b82f6' },
                    ticks: { color: '#3b82f6' }
                }
            }
        }
    });
}

function setFooterYearAndDate(lastUpdated) {
    const currentYear = new Date().getFullYear(); 
    
    // 1. Actualiza el año
    const footerElement = document.querySelector('.main-footer p:first-child');
    if (footerElement) {
        footerElement.innerHTML = footerElement.innerHTML.replace('${currentYear}', currentYear);
    }
    
    // 2. Actualiza la fecha de la última actualización (asumiendo que viene del JSON)
    const dateElement = document.querySelector('.main-footer p:last-child');
    if (dateElement) {
        // Formateamos la fecha si es necesario, o solo la insertamos.
        // Aquí insertamos solo el valor:
        dateElement.innerHTML = dateElement.innerHTML.replace('${lastUpdated}', lastUpdated.split('T')[0]);
    }
}


// =================================================================
// 4. FUNCIÓN DE CARGA E INICIALIZACIÓN
// =================================================================

async function loadDataAndInit() {
    try {
        const response = await fetch('data/data2.json'); 
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const mockData = await response.json();

        currentConversions = mockData.recentConversions;
        
        // Renderizado
        renderKpis(mockData.kpis);
        renderCpaChart(mockData.cpaChartData);
        renderBudgetChart(mockData.budgetChartData);
        renderCtrChart(mockData.ctrChartData);
        renderHistoryChart(mockData.historyChartData);
        
        setupDynamicConversions();
        setFooterYearAndDate(mockData.lastUpdated); // Llama a la función del footer

    } catch (error) {
        // ¡Si ves este error en F12, el problema es que no encuentra data.json!
        console.error("No se pudieron cargar los datos o hay un error de script:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadDataAndInit);


// script2.js

// ... (El resto de tu código de dashboard, KPIs, gráficos, etc.) ...

// =================================================================
// LÓGICA DEL MENÚ DE NAVEGACIÓN (HEADER) EN MÓVIL
// =================================================================
function setupHeaderNavToggle() {
    const toggleButton = document.getElementById('menu-toggle-button');
    const navMenu = document.getElementById('nav-menu-links');

    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', () => {
            // Esta línea añade o quita la clase 'hidden', haciendo visible el menú
            navMenu.classList.toggle('hidden'); 
            
            // Opcional: Cambiar el ícono de 'menu' a 'close' (la 'X')
            const icon = toggleButton.querySelector('span');
            if (icon) {
                icon.textContent = navMenu.classList.contains('hidden') ? 'menu' : 'close';
            }
        });
    }
}

// =================================================================
// LLAMADA FINAL EN DOMContentLoaded
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que esta línea esté presente para activar la navegación:
    setupHeaderNavToggle(); 
    
    // ... (otras llamadas a loadDataAndInit, setupDynamicConversions, etc.) ...
});

// =========================================================
// SCRIPT PARA ACTIVAR/DESACTIVAR EL MENÚ SUPERIOR (HAMBURGUESA)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elemento del botón de las 3 rayas
    const menuToggleButton = document.getElementById('menu-toggle-button');
    
    // 2. Elemento del menú de navegación que contiene los enlaces (Inicio, Dashboard, Contacto)
    const navMenuLinks = document.getElementById('nav-menu-links');

    // 3. Añadir el manejador de eventos
    if (menuToggleButton && navMenuLinks) {
        menuToggleButton.addEventListener('click', () => {
            // CLAVE: Alternar la clase 'hidden' de Tailwind.
            // Si tiene 'hidden', se quita y el menú aparece.
            // Si no tiene 'hidden', se añade y el menú se oculta.
            navMenuLinks.classList.toggle('hidden');
            
            // Opcional: Cambiar el icono (menu <-> close)
            const icon = menuToggleButton.querySelector('.material-icons-outlined');
            if (navMenuLinks.classList.contains('hidden')) {
                icon.textContent = 'menu'; // Está oculto, mostrar icono de menú
            } else {
                icon.textContent = 'close'; // Está visible, mostrar icono de cierre
            }
        });
    }
});