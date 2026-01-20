import React, { useState } from 'react';
import type { PatientInfo } from '../types';

interface EmergencyRequestProps {
  onSubmit: (patientInfo: PatientInfo) => void;
}

const EmergencyRequest: React.FC<EmergencyRequestProps> = ({ onSubmit }) => {
  const [age, setAge] = useState<number>(50);
  const [symptoms, setSymptoms] = useState<string>('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [preferredConditions, setPreferredConditions] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      alert('症状を入力してください');
      return;
    }

    const patientInfo: PatientInfo = {
      age,
      symptoms: symptoms.trim(),
      severity,
      preferredConditions: preferredConditions.trim(),
    };

    onSubmit(patientInfo);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🚑 救急・紹介依頼入力</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        患者情報を入力してください。AIが最適な病院を提案します。
      </p>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            年齢
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min="0"
            max="120"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            症状 <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="例: 急な胸痛、呼吸困難"
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            重症度
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <option value="low">軽症 - 緊急性は低い</option>
            <option value="medium">中等症 - 早めの診察が必要</option>
            <option value="high">重症 - 早急な治療が必要</option>
            <option value="critical">最重症 - 緊急対応が必要</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            希望条件（任意）
          </label>
          <textarea
            value={preferredConditions}
            onChange={(e) => setPreferredConditions(e.target.value)}
            placeholder="例: 近くの病院を希望、特定の専門医を希望など"
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          🤖 AI推薦を取得
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        borderRadius: '4px',
      }}>
        <strong>⚠️ 注意事項</strong>
        <ul style={{ marginTop: '10px', marginBottom: 0 }}>
          <li>AIは判断を提案するのみで、最終判断は医療従事者が行います</li>
          <li>緊急性が高い場合は、まず119番へ連絡してください</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyRequest;
