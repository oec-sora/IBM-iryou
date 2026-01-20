import React, { useState } from 'react';
import type { AIRecommendation, PatientInfo, TransportRecord } from '../types';

interface PostTransportRecordProps {
  selectedRecommendation: AIRecommendation;
  patientInfo: PatientInfo;
  onComplete: (record: TransportRecord) => void;
}

const PostTransportRecord: React.FC<PostTransportRecordProps> = ({
  selectedRecommendation,
  patientInfo,
  onComplete,
}) => {
  const [accepted, setAccepted] = useState<boolean>(true);
  const [transportTime, setTransportTime] = useState<number>(30);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: TransportRecord = {
      id: `TR-${Date.now()}`,
      patientInfo,
      selectedHospital: selectedRecommendation.hospital,
      accepted,
      transportTime,
      notes: notes.trim(),
      timestamp: new Date(),
    };

    onComplete(record);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📝 搬送後記録</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        搬送結果を記録してください。このデータは次回のAI判断に活用されます。
      </p>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}>
        <h3 style={{ marginTop: 0 }}>搬送先病院</h3>
        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0' }}>
          {selectedRecommendation.hospital.name}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>所在地:</strong> {selectedRecommendation.hospital.location.address}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '16px' }}>
            受入結果
          </label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{
              flex: 1,
              padding: '20px',
              border: `2px solid ${accepted ? '#4CAF50' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: accepted ? '#e8f5e9' : 'white',
              transition: 'all 0.2s',
            }}>
              <input
                type="radio"
                name="accepted"
                checked={accepted}
                onChange={() => setAccepted(true)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ fontSize: '1.5em', marginRight: '8px' }}>✅</span>
              <strong>受入成功</strong>
              <p style={{ margin: '5px 0 0 30px', fontSize: '0.9em', color: '#666' }}>
                病院が患者を受け入れた
              </p>
            </label>
            <label style={{
              flex: 1,
              padding: '20px',
              border: `2px solid ${!accepted ? '#F44336' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: !accepted ? '#ffebee' : 'white',
              transition: 'all 0.2s',
            }}>
              <input
                type="radio"
                name="accepted"
                checked={!accepted}
                onChange={() => setAccepted(false)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ fontSize: '1.5em', marginRight: '8px' }}>❌</span>
              <strong>受入不可</strong>
              <p style={{ margin: '5px 0 0 30px', fontSize: '0.9em', color: '#666' }}>
                受入を断られた
              </p>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            所要時間（分）
          </label>
          <input
            type="number"
            value={transportTime}
            onChange={(e) => setTransportTime(Number(e.target.value))}
            min="0"
            max="300"
            step="5"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            依頼から受入（または拒否）までの時間を入力してください
          </p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            備考・詳細記録
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="例: スムーズに受入、特記事項なし / ベッド満床で受入不可だった / 専門医不在のため断られた"
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
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
            backgroundColor: '#2196F3',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
          ✓ 記録を保存して完了
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderLeft: '4px solid #4CAF50',
        borderRadius: '4px',
      }}>
        <strong>📊 データ活用</strong>
        <p style={{ marginTop: '10px', marginBottom: 0 }}>
          記録されたデータは、AIの判断精度向上に活用されます。受入成功率、所要時間、
          拒否理由などが次回の病院推薦時に考慮されます。
        </p>
      </div>
    </div>
  );
};

export default PostTransportRecord;
