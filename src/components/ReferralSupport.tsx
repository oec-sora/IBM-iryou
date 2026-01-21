import React, { useState } from 'react';
import type { AIRecommendation, PatientInfo } from '../types';

interface ReferralSupportProps {
  selectedRecommendation: AIRecommendation;
  patientInfo: PatientInfo;
  referralLetter: string;
  acceptanceRequest: string;
  onSend: () => void;
  onBack: () => void;
}

const ReferralSupport: React.FC<ReferralSupportProps> = ({
  selectedRecommendation,
  referralLetter,
  acceptanceRequest,
  onSend,
  onBack,
}) => {
  const [editedReferralLetter, setEditedReferralLetter] = useState(referralLetter);
  const [editedAcceptanceRequest, setEditedAcceptanceRequest] = useState(acceptanceRequest);
  const [activeTab, setActiveTab] = useState<'referral' | 'acceptance'>('referral');

  const handleSend = () => {
    if (window.confirm('紹介状と受入依頼を送信しますか？')) {
      onSend();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>📄 紹介・交渉支援</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        AIが自動生成した紹介状と受入依頼文を確認・編集してください。
      </p>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <h3 style={{ marginTop: 0 }}>選択された病院</h3>
        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0' }}>
          {selectedRecommendation.hospital.name}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>診療科:</strong> {selectedRecommendation.hospital.departments.join('、')}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>所在地:</strong> {selectedRecommendation.hospital.location.address}
        </p>
      </div>

      {/* タブナビゲーション */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('referral')}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: activeTab === 'referral' ? 'white' : '#666',
            backgroundColor: activeTab === 'referral' ? '#2196F3' : '#f5f5f5',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
          }}
        >
          📋 紹介状
        </button>
        <button
          onClick={() => setActiveTab('acceptance')}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: activeTab === 'acceptance' ? 'white' : '#666',
            backgroundColor: activeTab === 'acceptance' ? '#2196F3' : '#f5f5f5',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
          }}
        >
          🚑 受入依頼
        </button>
      </div>

      {/* 紹介状タブ */}
      {activeTab === 'referral' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>紹介状（編集可能）</h3>
            <span style={{ fontSize: '0.9em', color: '#666' }}>
              ✏️ 内容を編集できます
            </span>
          </div>
          <textarea
            value={editedReferralLetter}
            onChange={(e) => setEditedReferralLetter(e.target.value)}
            rows={20}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              lineHeight: '1.6',
            }}
          />
        </div>
      )}

      {/* 受入依頼タブ */}
      {activeTab === 'acceptance' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>受入依頼文（編集可能）</h3>
            <span style={{ fontSize: '0.9em', color: '#666' }}>
              ✏️ 内容を編集できます
            </span>
          </div>
          <textarea
            value={editedAcceptanceRequest}
            onChange={(e) => setEditedAcceptanceRequest(e.target.value)}
            rows={18}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              lineHeight: '1.6',
            }}
          />
        </div>
      )}

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
          onClick={handleSend}
          style={{
            flex: 2,
            padding: '15px',
            fontSize: '16px',
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
          📤 送信する
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderLeft: '4px solid #4CAF50',
        borderRadius: '4px',
      }}>
        <strong>💡 ヒント</strong>
        <ul style={{ marginTop: '10px', marginBottom: 0 }}>
          <li>AIが生成した文書は、編集して内容を調整できます</li>
          <li>送信前に、両方のタブの内容を確認してください</li>
          <li>送信後、搬送記録を入力して次回の判断に活用します</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSupport;
