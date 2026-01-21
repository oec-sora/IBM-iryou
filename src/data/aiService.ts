import type { Hospital, PatientInfo, AIRecommendation } from '../types';

// 患者位置を仮定（東京駅周辺）
const DEFAULT_PATIENT_LOCATION = { latitude: 35.6812, longitude: 139.7671 };

// 2点間の距離を計算（簡易的なヒュベニの公式）
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// AIによる病院推薦アルゴリズム
export function generateRecommendations(
  hospitals: Hospital[],
  patientInfo: PatientInfo
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  hospitals.forEach((hospital) => {
    // 距離計算
    const distance = calculateDistance(
      DEFAULT_PATIENT_LOCATION.latitude,
      DEFAULT_PATIENT_LOCATION.longitude,
      hospital.location.latitude,
      hospital.location.longitude
    );

    // スコアリング基準
    let score = 0;
    const reasoning = {
      distance: '',
      availability: '',
      specialty: '',
      performance: '',
    };

    // 1. 救急受入可否（重症度が高い場合は必須）
    if (
      (patientInfo.severity === 'critical' || patientInfo.severity === 'high') &&
      !hospital.acceptsEmergency
    ) {
      return; // 救急を受け入れない病院は除外
    }

    // 2. 距離スコア（近いほど高得点）
    const distanceScore = Math.max(0, 100 - distance * 10);
    score += distanceScore * 0.3;
    reasoning.distance = `距離: ${distance.toFixed(1)}km（${
      distance < 3 ? '近距離' : distance < 7 ? '中距離' : '遠距離'
    }）`;

    // 3. 空き病床スコア
    const bedAvailabilityRate = hospital.availableBeds / hospital.totalBeds;
    const bedScore = bedAvailabilityRate * 100;
    score += bedScore * 0.25;
    reasoning.availability = `空き病床: ${hospital.availableBeds}床/${hospital.totalBeds}床（${(bedAvailabilityRate * 100).toFixed(1)}%）${
      hospital.hasOnCallDoctor ? '、当直医配置あり' : ''
    }`;

    // 4. 専門性スコア（症状に関連する診療科があるか）
    let specialtyScore = 0;
    const symptomKeywords = patientInfo.symptoms.toLowerCase();
    
    if (symptomKeywords.includes('脳') || symptomKeywords.includes('頭') || symptomKeywords.includes('意識')) {
      if (hospital.specialties.includes('脳神経外科')) specialtyScore = 100;
    } else if (symptomKeywords.includes('心臓') || symptomKeywords.includes('胸痛')) {
      if (hospital.specialties.includes('循環器科') || hospital.specialties.includes('心臓血管外科')) specialtyScore = 100;
    } else if (symptomKeywords.includes('骨折') || symptomKeywords.includes('外傷')) {
      if (hospital.departments.includes('整形外科') || hospital.departments.includes('外科')) specialtyScore = 80;
    } else if (symptomKeywords.includes('子供') || symptomKeywords.includes('小児')) {
      if (hospital.departments.includes('小児科')) specialtyScore = 100;
    } else {
      // 一般的な救急対応
      if (hospital.acceptsEmergency) specialtyScore = 60;
    }
    
    score += specialtyScore * 0.3;
    reasoning.specialty = `専門性: ${hospital.specialties.join('、')}が対応可能`;

    // 5. 過去実績スコア
    const performanceScore =
      (hospital.pastPerformance.successRate / 100) * 100;
    score += performanceScore * 0.15;
    reasoning.performance = `過去実績: ${hospital.pastPerformance.totalCases}件（成功率${hospital.pastPerformance.successRate}%）`;

    // 重症度による補正
    if (patientInfo.severity === 'critical' || patientInfo.severity === 'high') {
      if (hospital.acceptsEmergency && hospital.hasOnCallDoctor) {
        score *= 1.2; // ボーナス
      }
    }

    recommendations.push({
      hospital,
      score: Math.min(100, score),
      reasoning,
    });
  });

  // スコア順にソート
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // 上位5件を返す
}

// 紹介状生成
export function generateReferralLetter(
  patientInfo: PatientInfo,
  hospital: Hospital
): string {
  const today = new Date().toLocaleDateString('ja-JP');
  
  return `紹介状

${hospital.name} 御中

拝啓 時下ますますご清祥のこととお慶び申し上げます。

下記患者様につきまして、貴院での診察・治療をお願いしたく、ご紹介申し上げます。

【患者情報】
年齢: ${patientInfo.age}歳
主訴: ${patientInfo.symptoms}
重症度: ${
    patientInfo.severity === 'critical'
      ? '最重症'
      : patientInfo.severity === 'high'
      ? '重症'
      : patientInfo.severity === 'medium'
      ? '中等症'
      : '軽症'
  }

【紹介理由】
${
  patientInfo.severity === 'critical' || patientInfo.severity === 'high'
    ? '緊急性が高く、高度な医療が必要と判断されるため、貴院の専門的な診療をお願いいたします。'
    : '専門的な診療が必要と判断されるため、貴院での診察をお願いいたします。'
}

${patientInfo.preferredConditions ? `【患者希望】\n${patientInfo.preferredConditions}\n\n` : ''}
何卒よろしくお願い申し上げます。

敬具

${today}
紹介元医療機関`;
}

// 受入依頼文生成
export function generateAcceptanceRequest(
  patientInfo: PatientInfo,
  hospital: Hospital
): string {
  return `【緊急受入依頼】

${hospital.name} 様

下記患者の受入をお願いいたします。

■ 患者情報
・年齢: ${patientInfo.age}歳
・症状: ${patientInfo.symptoms}
・重症度: ${
    patientInfo.severity === 'critical'
      ? '最重症（緊急対応必要）'
      : patientInfo.severity === 'high'
      ? '重症（早急な対応必要）'
      : patientInfo.severity === 'medium'
      ? '中等症'
      : '軽症'
  }

■ 受入希望時間
直ちに受入可能かご確認ください。

■ 必要な対応
${
  patientInfo.severity === 'critical' || patientInfo.severity === 'high'
    ? '・救急対応\n・専門医による診察\n・入院準備'
    : '・外来診察\n・必要に応じて入院'
}

受入可否につきまして、至急ご連絡をお願いいたします。

よろしくお願いいたします。`;
}
