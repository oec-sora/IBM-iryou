import React, { useState } from 'react';
import type { AIRecommendation, PatientInfo } from '../types';

interface AIRecommendationDisplayProps {
  recommendations: AIRecommendation[];
  patientInfo: PatientInfo;
  onSelectHospital: (recommendation: AIRecommendation) => void;
  onBack: () => void;
}

const AIRecommendationDisplay: React.FC<AIRecommendationDisplayProps> = ({
  recommendations,
  patientInfo,
  onSelectHospital,
  onBack,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleApprove = () => {
    if (selectedIndex !== null) {
      onSelectHospital(recommendations[selectedIndex]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🤖 AI判断根拠表示</h2>
      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <h3 style={{ marginTop: 0 }}>患者情報</h3>
        <p><strong>年齢:</strong> {patientInfo.age}歳</p>
        <p><strong>症状:</strong> {patientInfo.symptoms}</p>
        <p><strong>重症度:</strong> {
          patientInfo.severity === 'critical' ? '最重症' :
          patientInfo.severity === 'high' ? '重症' :
          patientInfo.severity === 'medium' ? '中等症' : '軽症'
        }</p>
        {patientInfo.preferredConditions && (
          <p><strong>希望条件:</strong> {patientInfo.preferredConditions}</p>
        )}
      </div>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        AIが分析した推薦病院を表示しています。人が確認・承認してください。
      </p>

      <div style={{ marginBottom: '20px' }}>
        {recommendations.map((rec, index) => (
          <div
            key={rec.hospital.id}
            onClick={() => setSelectedIndex(index)}
            style={{
              backgroundColor: selectedIndex === index ? '#e8f5e9' : 'white',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: selectedIndex === index ? '2px solid #4CAF50' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {index === 0 && <span style={{ fontSize: '1.2em' }}>🥇</span>}
                  {index === 1 && <span style={{ fontSize: '1.2em' }}>🥈</span>}
                  {index === 2 && <span style={{ fontSize: '1.2em' }}>🥉</span>}
                  {rec.hospital.name}
                </h3>
                
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}>
                  適合スコア: {rec.score.toFixed(1)}点
                </div>

                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#333' }}>📋 推薦理由</h4>
                  
                  <div style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '3px solid #2196F3' }}>
                    <strong>📍 {rec.reasoning.distance}</strong>
                  </div>
                  
                  <div style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '3px solid #4CAF50' }}>
                    <strong>🛏️ {rec.reasoning.availability}</strong>
                  </div>
                  
                  <div style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '3px solid #FF9800' }}>
                    <strong>🏥 {rec.reasoning.specialty}</strong>
                  </div>
                  
                  <div style={{ paddingLeft: '10px', borderLeft: '3px solid #9C27B0' }}>
                    <strong>📊 {rec.reasoning.performance}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>診療科:</strong> {rec.hospital.departments.join('、')}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>救急受入:</strong> {rec.hospital.acceptsEmergency ? '✅ 可能' : '❌ 不可'}
                    {' | '}
                    <strong>当直医:</strong> {rec.hospital.hasOnCallDoctor ? '✅ あり' : '❌ なし'}
                  </p>
                </div>
              </div>
            </div>

            {selectedIndex === index && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#fff9e6',
                borderRadius: '4px',
              }}>
                ✅ この病院を選択中
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#666',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← 戻る
        </button>
        <button
          onClick={handleApprove}
          disabled={selectedIndex === null}
          style={{
            flex: 2,
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: selectedIndex !== null ? '#4CAF50' : '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
          }}
        >
          ✓ 承認して次へ進む
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        borderRadius: '4px',
      }}>
        <strong>⚠️ 重要</strong>
        <p style={{ marginTop: '10px', marginBottom: 0 }}>
          AIの推薦は参考情報です。最終的な受入判断は、病院側の医療従事者が行います。
          選択後、受入依頼を送信してください。
        </p>
      </div>
    </div>
  );
};

export default AIRecommendationDisplay;
