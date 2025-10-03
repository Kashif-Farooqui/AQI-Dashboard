// Global variables
let aqiTrendChart, pollutantsChart, forecastChart;
let currentCity = 'delhi';

// Simulated data storage
const cityData = {
    delhi: {
        current: { aqi: 187, pm25: 95, pm10: 167, no2: 45, o3: 32, so2: 18, co: 1.2 },
        history: [152, 168, 175, 182, 178, 191, 187],
        forecast: generateForecast(187, 24)
    },
    mumbai: {
        current: { aqi: 142, pm25: 72, pm10: 128, no2: 38, o3: 28, so2: 15, co: 0.9 },
        history: [128, 135, 138, 145, 139, 148, 142],
        forecast: generateForecast(142, 24)
    },
    bangalore: {
        current: { aqi: 98, pm25: 48, pm10: 88, no2: 28, o3: 22, so2: 12, co: 0.6 },
        history: [85, 92, 88, 95, 91, 102, 98],
        forecast: generateForecast(98, 24)
    },
    kolkata: {
        current: { aqi: 164, pm25: 82, pm10: 145, no2: 42, o3: 30, so2: 16, co: 1.0 },
        history: [145, 158, 162, 168, 155, 171, 164],
        forecast: generateForecast(164, 24)
    },
    chennai: {
        current: { aqi: 115, pm25: 58, pm10: 102, no2: 32, o3: 25, so2: 13, co: 0.7 },
        history: [102, 108, 112, 118, 110, 122, 115],
        forecast: generateForecast(115, 24)
    },
    lucknow: {
        current: { aqi: 195, pm25: 102, pm10: 175, no2: 48, o3: 35, so2: 20, co: 1.3 },
        history: [168, 182, 188, 192, 185, 198, 195],
        forecast: generateForecast(195, 24)
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateDashboard();
    setupEventListeners();
    
    // Auto-refresh every 5 minutes
    setInterval(updateDashboard, 300000);
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('citySelect').addEventListener('change', (e) => {
        currentCity = e.target.value;
        updateDashboard();
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        updateDashboard();
        showNotification('Data refreshed successfully!');
    });

    document.getElementById('closeAlert').addEventListener('click', () => {
        document.getElementById('alertBanner').classList.add('hidden');
    });
}

// Update dashboard with current city data
function updateDashboard() {
    const data = cityData[currentCity];
    
    // Update current AQI
    updateCurrentAQI(data.current.aqi);
    
    // Update pollutants
    updatePollutants(data.current);
    
    // Update predictions
    updatePredictions(data.forecast);
    
    // Update charts
    updateCharts(data);
    
    // Update last updated time
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
    
    // Check for alerts
    checkAlerts(data);
}

// Update current AQI display
function updateCurrentAQI(aqi) {
    const aqiValue = document.getElementById('aqiValue');
    const aqiCategory = document.getElementById('aqiCategory');
    
    aqiValue.textContent = aqi;
    
    const category = getAQICategory(aqi);
    aqiCategory.textContent = category.label;
    aqiCategory.className = 'aqi-category ' + category.class;
    aqiValue.style.color = category.color;
}

// Get AQI category
function getAQICategory(aqi) {
    if (aqi <= 50) return { label: 'Good', class: 'aqi-good', color: '#00e400' };
    if (aqi <= 100) return { label: 'Moderate', class: 'aqi-moderate', color: '#ffff00' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', class: 'aqi-unhealthy-sensitive', color: '#ff7e00' };
    if (aqi <= 200) return { label: 'Unhealthy', class: 'aqi-unhealthy', color: '#ff0000' };
    if (aqi <= 300) return { label: 'Very Unhealthy', class: 'aqi-very-unhealthy', color: '#8f3f97' };
    return { label: 'Hazardous', class: 'aqi-hazardous', color: '#7e0023' };
}

// Update pollutants
function updatePollutants(current) {
    document.getElementById('pm25Value').textContent = current.pm25 + ' μg/m³';
    document.getElementById('pm10Value').textContent = current.pm10 + ' μg/m³';
    document.getElementById('no2Value').textContent = current.no2 + ' ppb';
    document.getElementById('o3Value').textContent = current.o3 + ' ppb';
    document.getElementById('so2Value').textContent = current.so2 + ' ppb';
    document.getElementById('coValue').textContent = current.co + ' ppm';
}

// Update predictions
function updatePredictions(forecast) {
    const tomorrowAQI = Math.round(forecast[forecast.length - 1]);
    const avg24h = Math.round(forecast.reduce((a, b) => a + b, 0) / forecast.length);
    
    document.getElementById('tomorrowAQI').textContent = tomorrowAQI;
    document.getElementById('avg24hAQI').textContent = avg24h;
}

// Check and display alerts
function checkAlerts(data) {
    const tomorrowAQI = Math.round(data.forecast[data.forecast.length - 1]);
    const alertBanner = document.getElementById('alertBanner');
    const alertMessage = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');
    
    if (tomorrowAQI > 150) {
        alertIcon.textContent = '🚨';
        alertMessage.textContent = `Alert: Unhealthy air quality expected tomorrow (AQI: ${tomorrowAQI}). Consider staying indoors and wearing a mask if you go outside.`;
        alertBanner.classList.remove('hidden');
    } else if (tomorrowAQI > 100) {
        alertIcon.textContent = '⚠️';
        alertMessage.textContent = `Warning: Air quality tomorrow may be unhealthy for sensitive groups (AQI: ${tomorrowAQI}). Take precautions if you're at risk.`;
        alertBanner.classList.remove('hidden');
    } else {
        alertBanner.classList.add('hidden');
    }
}

// Initialize charts
function initializeCharts() {
    // AQI Trend Chart
    const aqiCtx = document.getElementById('aqiTrendChart').getContext('2d');
    aqiTrendChart = new Chart(aqiCtx, {
        type: 'line',
        data: {
            labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
            datasets: [{
                label: 'AQI',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI Value'
                    }
                }
            }
        }
    });

    // Pollutants Chart
    const pollutantsCtx = document.getElementById('pollutantsChart').getContext('2d');
    pollutantsChart = new Chart(pollutantsCtx, {
        type: 'bar',
        data: {
            labels: ['PM2.5', 'PM10', 'NO₂', 'O₃', 'SO₂', 'CO'],
            datasets: [{
                label: 'Concentration',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'μg/m³ / ppb / ppm'
                    }
                }
            }
        }
    });

    // Forecast Chart
    const forecastCtx = document.getElementById('forecastChart').getContext('2d');
    forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Predicted AQI',
                data: [],
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI Value'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hours from Now'
                    }
                }
            }
        }
    });
}

// Update charts with data
function updateCharts(data) {
    // Update AQI Trend Chart
    aqiTrendChart.data.datasets[0].data = data.history;
    aqiTrendChart.update();

    // Update Pollutants Chart
    pollutantsChart.data.datasets[0].data = [
        data.current.pm25,
        data.current.pm10,
        data.current.no2,
        data.current.o3,
        data.current.so2,
        data.current.co
    ];
    pollutantsChart.update();

    // Update Forecast Chart
    const forecastLabels = data.forecast.map((_, i) => i + 'h');
    forecastChart.data.labels = forecastLabels;
    forecastChart.data.datasets[0].data = data.forecast;
    forecastChart.update();
}

// Generate forecast data (simulated ML prediction)
function generateForecast(currentAQI, hours) {
    const forecast = [];
    let baseAQI = currentAQI;
    
    // Simulate ML/DL model predictions with realistic patterns
    for (let i = 0; i < hours; i++) {
        // Add hourly variation (simulating diurnal patterns)
        const hourOfDay = (new Date().getHours() + i) % 24;
        let variation = 0;
        
        // Morning rush hour (7-9 AM) - higher pollution
        if (hourOfDay >= 7 && hourOfDay <= 9) {
            variation = Math.random() * 15 + 10;
        }
        // Evening rush hour (6-8 PM) - higher pollution
        else if (hourOfDay >= 18 && hourOfDay <= 20) {
            variation = Math.random() * 12 + 8;
        }
        // Night time (11 PM - 5 AM) - lower pollution
        else if (hourOfDay >= 23 || hourOfDay <= 5) {
            variation = -(Math.random() * 10 + 5);
        }
        // Daytime - moderate variation
        else {
            variation = (Math.random() - 0.5) * 10;
        }
        
        // Add random walk with trend
        const randomWalk = (Math.random() - 0.48) * 5;
        baseAQI = baseAQI + variation + randomWalk;
        
        // Keep AQI in realistic bounds
        baseAQI = Math.max(30, Math.min(400, baseAQI));
        
        forecast.push(Math.round(baseAQI));
    }
    
    return forecast;
}

// Show notification
function showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00e400 0%, #00a000 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Simulate real-time data updates (for demo purposes)
function simulateDataUpdate() {
    // Update current city data with small random changes
    const data = cityData[currentCity];
    const variance = (Math.random() - 0.5) * 10;
    
    data.current.aqi = Math.max(20, Math.min(500, data.current.aqi + variance));
    data.current.pm25 = Math.max(10, Math.min(250, data.current.pm25 + (Math.random() - 0.5) * 5));
    data.current.pm10 = Math.max(20, Math.min(400, data.current.pm10 + (Math.random() - 0.5) * 8));
    data.current.no2 = Math.max(5, Math.min(100, data.current.no2 + (Math.random() - 0.5) * 3));
    data.current.o3 = Math.max(10, Math.min(80, data.current.o3 + (Math.random() - 0.5) * 2));
    data.current.so2 = Math.max(5, Math.min(50, data.current.so2 + (Math.random() - 0.5) * 2));
    data.current.co = Math.max(0.3, Math.min(5, data.current.co + (Math.random() - 0.5) * 0.1));
    
    // Update history
    data.history.shift();
    data.history.push(Math.round(data.current.aqi));
    
    // Regenerate forecast
    data.forecast = generateForecast(data.current.aqi, 24);
}

// Add CSS animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'R' to refresh
    if (e.key === 'r' || e.key === 'R') {
        updateDashboard();
        showNotification('Dashboard refreshed!');
    }
});

// Export functions for potential API integration
window.dashboardAPI = {
    updateWithRealData: function(cityName, aqiData) {
        // Function to update dashboard with real API data
        if (cityData[cityName]) {
            cityData[cityName].current = aqiData.current;
            if (aqiData.history) cityData[cityName].history = aqiData.history;
            if (aqiData.forecast) cityData[cityName].forecast = aqiData.forecast;
            
            if (currentCity === cityName) {
                updateDashboard();
            }
        }
    },
    
    getCurrentData: function() {
        return cityData[currentCity];
    },
    
    getAllCities: function() {
        return Object.keys(cityData);
    }
};

// Log initialization message
console.log('🌍 AQI Dashboard initialized successfully!');
console.log('💡 Use window.dashboardAPI to integrate with real API data');
console.log('⌨️  Press "R" to refresh the dashboard');
