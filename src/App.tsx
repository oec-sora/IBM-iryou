import { useState } from 'react';
import Dashboard from './components/Dashboard';
import EmergencyRequest from './components/EmergencyRequest';
import AIRecommendationDisplay from './components/AIRecommendationDisplay';
import ReferralSupport from './components/ReferralSupport';
import PostTransportRecord from './components/PostTransportRecord';
import { mockHospitals } from './data/mockData';
import { 
  generateRecommendations, 
  generateReferralLetter, 
  generateAcceptanceRequest 
} from './data/aiService';
import type { PatientInfo, AIRecommendation, TransportRecord } from './types';
import './App.css';

type Screen = 'dashboard' | 'request' | 'recommendation' | 'referral' | 'record' | 'complete';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const [transportRecords, setTransportRecords] = useState<TransportRecord[]>([]);

  // 患者情報を受け取り、AI推薦を生成
  const handlePatientSubmit = (info: PatientInfo) => {
    setPatientInfo(info);
    const recs = generateRecommendations(mockHospitals, info);
    setRecommendations(recs);
    setCurrentScreen('recommendation');
  };

  // 病院を選択
  const handleSelectHospital = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation);
    setCurrentScreen('referral');
  };

  // 紹介状送信
  const handleSendReferral = () => {
    setCurrentScreen('record');
  };

  // 搬送記録を保存
  const handleCompleteRecord = (record: TransportRecord) => {
    setTransportRecords([...transportRecords, record]);
    setCurrentScreen('complete');
  };

  // 新規依頼を開始
  const handleNewRequest = () => {
    setPatientInfo(null);
    setRecommendations([]);
    setSelectedRecommendation(null);
    setCurrentScreen('request');
  };

  // ダッシュボードに戻る
  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* ヘッダー */}
      <header style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.8em' }}>🏥 医療リソース自律調整AI Agent</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            地域医療向け - 病院推薦支援システム（モック版）
          </p>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        padding: '10px 20px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: '8px 16px',
              backgroundColor: currentScreen === 'dashboard' ? '#2196F3' : '#f5f5f5',
              color: currentScreen === 'dashboard' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentScreen === 'dashboard' ? 'bold' : 'normal',
            }}
          >
            📊 ダッシュボード
          </button>
          <button
            onClick={handleNewRequest}
            style={{
              padding: '8px 16px',
              backgroundColor: currentScreen === 'request' ? '#2196F3' : '#f5f5f5',
              color: currentScreen === 'request' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentScreen === 'request' ? 'bold' : 'normal',
            }}
          >
            🚑 新規依頼
          </button>
          {transportRecords.length > 0 && (
            <span style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.9em',
            }}>
              記録: {transportRecords.length}件
            </span>
          )}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main>
        {currentScreen === 'dashboard' && (
          <Dashboard hospitals={mockHospitals} />
        )}

        {currentScreen === 'request' && (
          <EmergencyRequest onSubmit={handlePatientSubmit} />
        )}

        {currentScreen === 'recommendation' && patientInfo && (
          <AIRecommendationDisplay
            recommendations={recommendations}
            patientInfo={patientInfo}
            onSelectHospital={handleSelectHospital}
            onBack={() => setCurrentScreen('request')}
          />
        )}

        {currentScreen === 'referral' && selectedRecommendation && patientInfo && (
          <ReferralSupport
            selectedRecommendation={selectedRecommendation}
            patientInfo={patientInfo}
            referralLetter={generateReferralLetter(patientInfo, selectedRecommendation.hospital)}
            acceptanceRequest={generateAcceptanceRequest(patientInfo, selectedRecommendation.hospital)}
            onSend={handleSendReferral}
            onBack={() => setCurrentScreen('recommendation')}
          />
        )}

        {currentScreen === 'record' && selectedRecommendation && patientInfo && (
          <PostTransportRecord
            selectedRecommendation={selectedRecommendation}
            patientInfo={patientInfo}
            onComplete={handleCompleteRecord}
          />
        )}

        {currentScreen === 'complete' && (
          <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '4em', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>記録が完了しました</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                搬送記録が保存されました。このデータは次回のAI判断に活用されます。
              </p>
              
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '30px',
                textAlign: 'left',
              }}>
                <h3>記録された情報</h3>
                <p><strong>病院:</strong> {selectedRecommendation?.hospital.name}</p>
                <p><strong>記録件数:</strong> {transportRecords.length}件</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={handleBackToDashboard}
                  style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#666',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  📊 ダッシュボードへ
                </button>
                <button
                  onClick={handleNewRequest}
                  style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  🚑 新規依頼を開始
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        marginTop: '40px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          医療リソース自律調整AI Agent - モックシステム | 
          AIは判断を提案するのみで、最終判断は医療従事者が行います
        </p>
      </footer>
    </div>
  );
}

export default App;
