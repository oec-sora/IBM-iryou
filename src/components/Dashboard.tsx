import React from 'react';
import type { Hospital } from '../types';

interface DashboardProps {
  hospitals: Hospital[];
}

const Dashboard: React.FC<DashboardProps> = ({ hospitals }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🏥 地域医療リソース ダッシュボード</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        地域内の病院のリアルタイム状況を表示しています
      </p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>病院名</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>診療科</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>空き病床</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>当直医</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>救急受入</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>所在地</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, index) => (
              <tr key={hospital.id} style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                  {hospital.name}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontSize: '0.9em' }}>
                  {hospital.departments.slice(0, 3).join('、')}
                  {hospital.departments.length > 3 && '...'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: hospital.availableBeds > 10 ? '#4CAF50' :
                                     hospital.availableBeds > 5 ? '#FFC107' : '#F44336',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                    {hospital.availableBeds}/{hospital.totalBeds}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '1.5em',
                  }}>
                    {hospital.hasOnCallDoctor ? '✅' : '❌'}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '1.5em',
                  }}>
                    {hospital.acceptsEmergency ? '🚑' : '⛔'}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontSize: '0.9em', color: '#666' }}>
                  {hospital.location.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h4 style={{ marginTop: 0 }}>📊 統計情報</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>総病院数:</strong> {hospitals.length}
          </div>
          <div>
            <strong>救急受入可能:</strong> {hospitals.filter(h => h.acceptsEmergency).length}
          </div>
          <div>
            <strong>総空き病床数:</strong> {hospitals.reduce((sum, h) => sum + h.availableBeds, 0)}
          </div>
          <div>
            <strong>当直医配置数:</strong> {hospitals.filter(h => h.hasOnCallDoctor).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
