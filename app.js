// Constants
const MINUTES_PER_KM = 3; // Estimated travel time in minutes per kilometer

// Mock data for hospitals
const hospitals = [
    {
        id: 1,
        name: "中央総合病院",
        departments: ["内科", "外科", "循環器科", "整形外科", "小児科"],
        availableBeds: 15,
        totalBeds: 50,
        hasOnCallDoctor: true,
        acceptsEmergency: true,
        distance: 2.5,
        specialties: ["心臓外科", "脳外科"],
        successRate: 0.95
    },
    {
        id: 2,
        name: "市民病院",
        departments: ["内科", "外科", "小児科"],
        availableBeds: 8,
        totalBeds: 30,
        hasOnCallDoctor: true,
        acceptsEmergency: true,
        distance: 4.2,
        specialties: ["一般外科"],
        successRate: 0.88
    },
    {
        id: 3,
        name: "東部医療センター",
        departments: ["内科", "整形外科", "循環器科"],
        availableBeds: 3,
        totalBeds: 25,
        hasOnCallDoctor: false,
        acceptsEmergency: false,
        distance: 6.8,
        specialties: ["整形外科"],
        successRate: 0.82
    },
    {
        id: 4,
        name: "北部クリニック病院",
        departments: ["内科", "小児科"],
        availableBeds: 12,
        totalBeds: 20,
        hasOnCallDoctor: true,
        acceptsEmergency: true,
        distance: 5.5,
        specialties: ["小児科"],
        successRate: 0.91
    },
    {
        id: 5,
        name: "南部総合医療病院",
        departments: ["内科", "外科", "循環器科", "整形外科"],
        availableBeds: 0,
        totalBeds: 40,
        hasOnCallDoctor: true,
        acceptsEmergency: false,
        distance: 3.8,
        specialties: ["循環器内科"],
        successRate: 0.93
    }
];

// Store current request and selected hospital
let currentRequest = null;
let selectedHospital = null;
let transportRecords = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    renderHospitals();
    populateRecordHospitalSelect();
    loadTransportRecords();
});

// Helper function to sanitize HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Screen navigation
function showScreen(screenId, event) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected screen
    document.getElementById(screenId).classList.add('active');
    
    // Add active class to corresponding tab if event is provided
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Dashboard functions
function renderHospitals(filteredHospitals = hospitals) {
    const hospitalList = document.getElementById('hospitalList');
    hospitalList.innerHTML = '';
    
    filteredHospitals.forEach(hospital => {
        const card = createHospitalCard(hospital);
        hospitalList.appendChild(card);
    });
}

function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    
    const status = hospital.acceptsEmergency ? 'available' : 
                   hospital.availableBeds > 0 ? 'limited' : 'unavailable';
    const statusText = hospital.acceptsEmergency ? '救急受入可' : 
                       hospital.availableBeds > 0 ? '要相談' : '満床';
    
    card.innerHTML = `
        <div class="hospital-header">
            <div class="hospital-name">${escapeHtml(hospital.name)}</div>
            <span class="status-badge ${status}">${statusText}</span>
        </div>
        <div class="hospital-info">
            <div class="info-item">
                <span class="info-label">診療科:</span>
                <span class="info-value">${hospital.departments.map(d => escapeHtml(d)).join(', ')}</span>
            </div>
            <div class="info-item">
                <span class="info-label">空き病床:</span>
                <span class="info-value">${hospital.availableBeds}/${hospital.totalBeds}床</span>
            </div>
            <div class="info-item">
                <span class="info-label">当直医:</span>
                <span class="badge ${hospital.hasOnCallDoctor ? 'yes' : 'no'}">
                    ${hospital.hasOnCallDoctor ? '有' : '無'}
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">救急受入:</span>
                <span class="badge ${hospital.acceptsEmergency ? 'yes' : 'no'}">
                    ${hospital.acceptsEmergency ? '可' : '不可'}
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">距離:</span>
                <span class="info-value">${hospital.distance}km</span>
            </div>
        </div>
    `;
    
    return card;
}

function filterHospitals() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const emergencyFilter = document.getElementById('emergencyFilter').checked;
    
    let filtered = hospitals;
    
    if (departmentFilter) {
        filtered = filtered.filter(h => h.departments.includes(departmentFilter));
    }
    
    if (emergencyFilter) {
        filtered = filtered.filter(h => h.acceptsEmergency);
    }
    
    renderHospitals(filtered);
}

// Request form functions
function submitRequest(event) {
    event.preventDefault();
    
    currentRequest = {
        age: document.getElementById('patientAge').value,
        symptoms: document.getElementById('symptoms').value,
        severity: document.getElementById('severity').value,
        department: document.getElementById('department').value,
        preferences: document.getElementById('preferences').value
    };
    
    // Simulate AI processing
    setTimeout(() => {
        const recommendations = generateRecommendations(currentRequest);
        displayRecommendations(recommendations);
    }, 1000);
}

function generateRecommendations(request) {
    // AI simulation: Score hospitals based on request
    const scoredHospitals = hospitals.map(hospital => {
        let score = 0;
        let reasons = [];
        
        // Check department match
        if (hospital.departments.includes(request.department)) {
            score += 30;
            reasons.push(`${request.department}の診療科あり`);
        }
        
        // Check emergency acceptance for severe cases
        if (request.severity === '重症' || request.severity === '最重症') {
            if (hospital.acceptsEmergency) {
                score += 25;
                reasons.push('救急受入可能');
            }
            if (hospital.hasOnCallDoctor) {
                score += 15;
                reasons.push('当直医が待機中');
            }
        }
        
        // Check bed availability
        if (hospital.availableBeds > 5) {
            score += 20;
            reasons.push(`空き病床が十分（${hospital.availableBeds}床）`);
        } else if (hospital.availableBeds > 0) {
            score += 10;
            reasons.push(`空き病床あり（${hospital.availableBeds}床）`);
        }
        
        // Distance factor (closer is better)
        if (hospital.distance < 3) {
            score += 15;
            reasons.push(`近距離（${hospital.distance}km）`);
        } else if (hospital.distance < 5) {
            score += 8;
            reasons.push(`比較的近い（${hospital.distance}km）`);
        }
        
        // Success rate
        score += hospital.successRate * 10;
        reasons.push(`過去の受入成功率: ${(hospital.successRate * 100).toFixed(0)}%`);
        
        return {
            ...hospital,
            score: score,
            reasons: reasons
        };
    });
    
    // Sort by score and return top 3
    return scoredHospitals
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

function displayRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';
    
    recommendations.forEach((hospital, index) => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.onclick = () => selectRecommendation(hospital);
        
        card.innerHTML = `
            <span class="recommendation-rank">推薦順位 ${index + 1}</span>
            <span class="recommendation-score">${hospital.score.toFixed(0)}点</span>
            <h3>${escapeHtml(hospital.name)}</h3>
            <ul>
                ${hospital.reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join('')}
            </ul>
        `;
        
        recommendationList.appendChild(card);
    });
    
    document.getElementById('recommendations').style.display = 'block';
    document.getElementById('rationaleTab').disabled = false;
}

function selectRecommendation(hospital) {
    selectedHospital = hospital;
    
    // Update UI
    document.querySelectorAll('.recommendation-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Show rationale screen
    showRationale();
}

// Rationale functions
function showRationale() {
    if (!selectedHospital) return;
    
    const rationaleContent = document.getElementById('rationaleContent');
    
    rationaleContent.innerHTML = `
        <div class="rationale-section">
            <div class="rationale-header">
                <h3>${escapeHtml(selectedHospital.name)} を推薦</h3>
                <span class="recommendation-score">${selectedHospital.score.toFixed(0)}点</span>
            </div>
            
            <div class="rationale-text">
                <p><strong>AI判断根拠：</strong></p>
                <p>患者様の状態（${escapeHtml(currentRequest.symptoms)}、重症度: ${escapeHtml(currentRequest.severity)}）を総合的に分析した結果、
                ${escapeHtml(selectedHospital.name)}が最適と判断いたしました。</p>
                
                <p>主な推薦理由は以下の通りです：</p>
            </div>
            
            <div class="criteria-list">
                ${selectedHospital.reasons.map(reason => `
                    <div class="criteria-item">✓ ${escapeHtml(reason)}</div>
                `).join('')}
            </div>
            
            <div class="rationale-text">
                <p><strong>詳細分析：</strong></p>
                <ul>
                    <li><strong>距離:</strong> ${selectedHospital.distance}km（所要時間: 約${Math.ceil(selectedHospital.distance * MINUTES_PER_KM)}分）</li>
                    <li><strong>専門医:</strong> ${selectedHospital.specialties.join('、')}の専門医が在籍</li>
                    <li><strong>過去実績:</strong> 過去30日間の受入成功率 ${(selectedHospital.successRate * 100).toFixed(0)}%</li>
                    <li><strong>現在の空き病床:</strong> ${selectedHospital.availableBeds}床（受入可能）</li>
                </ul>
            </div>
            
            <div class="approval-section">
                <h3>判断の確認</h3>
                <p>この推薦を承認し、紹介手続きに進みますか？</p>
                <div class="action-buttons">
                    <button onclick="approveRecommendation()" class="btn btn-success">承認して進む</button>
                    <button onclick="rejectRecommendation()" class="btn btn-secondary">別の病院を選択</button>
                </div>
            </div>
        </div>
    `;
    
    // Switch to rationale screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('rationale').classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-button')[2].classList.add('active');
}

function approveRecommendation() {
    document.getElementById('referralTab').disabled = false;
    generateReferralDocuments();
    showNotification('推薦を承認しました。紹介状を生成しています...');
    
    // Switch to referral screen
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('referral').classList.add('active');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-button')[3].classList.add('active');
    }, 1000);
}

function rejectRecommendation() {
    showNotification('別の病院を選択してください。');
    // Go back to request screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('request').classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-button')[1].classList.add('active');
}

// Referral document functions
function generateReferralDocuments() {
    const today = new Date().toLocaleDateString('ja-JP');
    // Note: Using template literals for textarea content - values are not rendered as HTML
    // but escaped for consistency and defense-in-depth
    const referralLetter = `
紹介状

${today}

${selectedHospital.name} 御中

拝啓　時下ますますご清栄のこととお慶び申し上げます。

下記患者様をご紹介申し上げますので、ご高診賜りますようお願い申し上げます。

【患者情報】
年齢: ${currentRequest.age}歳
主訴: ${currentRequest.symptoms}
重症度: ${currentRequest.severity}

【依頼診療科】
${currentRequest.department}

【臨床経過】
患者様は${currentRequest.symptoms}を主訴に受診されました。
現在の状態を総合的に判断し、専門的な治療が必要と考えられます。

貴院での専門的な診療をお願い申し上げます。

何卒よろしくお願い申し上げます。

敬具
    `.trim();
    
    const requestLetter = `
患者受入依頼

${selectedHospital.name} 御中

以下の患者様の受入をお願いしたく、ご連絡申し上げます。

【緊急度】${currentRequest.severity}
【必要診療科】${currentRequest.department}
【患者年齢】${currentRequest.age}歳
【症状】${currentRequest.symptoms}

【受入希望理由】
AIシステムによる総合判断により、貴院が最適と判断されました：
${selectedHospital.reasons.map(r => `・${r}`).join('\n')}

【その他】
${currentRequest.preferences || '特になし'}

お手数をおかけいたしますが、受入可否につきましてご返答いただけますと幸いです。

よろしくお願い申し上げます。
    `.trim();
    
    document.getElementById('referralLetter').value = referralLetter;
    document.getElementById('requestLetter').value = requestLetter;
}

function editDocument(documentId) {
    const textarea = document.getElementById(documentId);
    textarea.readOnly = false;
    textarea.focus();
    showNotification('編集モードに切り替えました。');
}

function sendReferral() {
    showNotification('紹介状と受入依頼を送信しました。');
    
    // Reset for next case
    setTimeout(() => {
        document.getElementById('requestForm').reset();
        document.getElementById('recommendations').style.display = 'none';
        document.getElementById('rationaleTab').disabled = true;
        document.getElementById('referralTab').disabled = true;
        currentRequest = null;
        selectedHospital = null;
        
        // Go to dashboard
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('dashboard').classList.add('active');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    }, 2000);
}

function cancelReferral() {
    if (confirm('紹介手続きをキャンセルしますか？')) {
        showNotification('キャンセルしました。');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('request').classList.add('active');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-button')[1].classList.add('active');
    }
}

// Record functions
function populateRecordHospitalSelect() {
    const select = document.getElementById('recordHospital');
    hospitals.forEach(hospital => {
        const option = document.createElement('option');
        option.value = hospital.id;
        option.textContent = hospital.name;
        select.appendChild(option);
    });
}

function submitRecord(event) {
    event.preventDefault();
    
    const hospitalId = parseInt(document.getElementById('recordHospital').value);
    const hospital = hospitals.find(h => h.id === hospitalId);
    
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString('ja-JP'),
        hospital: hospital.name,
        acceptance: document.getElementById('acceptanceResult').value,
        transportTime: document.getElementById('transportTime').value,
        notes: document.getElementById('notes').value
    };
    
    transportRecords.unshift(record);
    saveTransportRecords();
    displayTransportRecords();
    
    document.getElementById('recordForm').reset();
    showNotification('搬送記録を保存しました。この情報は次回のAI判断に活用されます。');
}

function saveTransportRecords() {
    localStorage.setItem('transportRecords', JSON.stringify(transportRecords));
}

function loadTransportRecords() {
    const saved = localStorage.getItem('transportRecords');
    if (saved) {
        transportRecords = JSON.parse(saved);
        displayTransportRecords();
    }
}

function displayTransportRecords() {
    const recordList = document.getElementById('recordList');
    
    if (transportRecords.length === 0) {
        recordList.innerHTML = '<p style="color: #999;">記録がありません</p>';
        return;
    }
    
    recordList.innerHTML = transportRecords.map(record => `
        <div class="record-item">
            <div class="record-date">${escapeHtml(record.date)}</div>
            <div class="record-details">
                <div><strong>病院:</strong> ${escapeHtml(record.hospital)}</div>
                <div><strong>結果:</strong> ${escapeHtml(record.acceptance)}</div>
                <div><strong>所要時間:</strong> ${escapeHtml(record.transportTime)}分</div>
            </div>
            ${record.notes ? `<div style="margin-top: 8px; color: #555;"><strong>備考:</strong> ${escapeHtml(record.notes)}</div>` : ''}
        </div>
    `).join('');
}

// Utility functions
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Simulate real-time updates (for demo purposes)
setInterval(() => {
    // Randomly update bed availability
    const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
    const change = Math.random() > 0.5 ? 1 : -1;
    
    randomHospital.availableBeds = Math.max(0, Math.min(
        randomHospital.totalBeds,
        randomHospital.availableBeds + change
    ));
    
    randomHospital.acceptsEmergency = randomHospital.availableBeds > 0 && randomHospital.hasOnCallDoctor;
    
    // Re-render if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
        filterHospitals();
    }
}, 10000); // Update every 10 seconds
