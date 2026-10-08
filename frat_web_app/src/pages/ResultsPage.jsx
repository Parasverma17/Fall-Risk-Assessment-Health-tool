/**
 * ResultsPage.jsx - FRAT Assessment Results Display with Visual Analytics
 * 
 * This component displays comprehensive fall risk assessment results including:
 * - Overall risk score and level
 * - Visual charts for data analysis (Doughnut, Pie, Bar, Radar)
 * - Component breakdown with progress bars
 * - Risk factors checklist
 * - Clinical recommendations
 * 
 * Charts Implementation:
 * - DOUGHNUT CHART: Shows overall risk score distribution (Lines 153-162, render 343-346)
 * - PIE CHART: Displays Part 2 risk factors summary (Lines 164-185, render 349-352)
 * - BAR CHART: Part 1 component score breakdown
 * - RADAR CHART: Individual risk factors assessment
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAssessmentResult } from "../api/fhir";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar as BarChart, Doughnut } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';
import { RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

// Register all Chart.js components needed for visualization
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// Maximum scores for each Part 1 component
const maxScores = {
  recentFalls: 8,
  highRiskMeds: 4,
  psychological: 4,
  cognitive: 4
};

// Part 2 risk factors configuration
const riskFactors = [
  { key: "vision", label: "Vision" },
  { key: "mobility", label: "Mobility" },
  { key: "transfers", label: "Transfers" },
  { key: "behaviours", label: "Behaviours" },
  { key: "adl", label: "Activities of Daily Living (A.D.L's)" },
  { key: "equipment", label: "Unsafe use of equipment" },
  { key: "footwear", label: "Footwear/Clothing" },
  { key: "environment", label: "Environment" },
  { key: "nutrition", label: "Nutrition" },
  { key: "continence", label: "Continence" },
  { key: "other", label: "Other" }
];

function ResultsPage() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAssessmentResult()
      .then(res => {
        const latest = res.data.assessments?.[res.data.assessments.length - 1] || {};
        setResult(latest);
      })
      .catch(() => setResult(null));
  }, []);

  if (!result) {
    return <Loader message="Loading assessment results..." subtitle="Please wait" />;
  }

  // Extract assessment data
  const score = result.risk_score ?? 0;
  const risk = {
    label: result.risk_level ?? "N/A",
    color:
      result.risk_level === "HIGH" ? "#dc3545" :
      result.risk_level === "MEDIUM" ? "#ffc107" :
      result.risk_level === "LOW" ? "#28a745" : "#6c757d"
  };

  // Calculate Part 1 component scores
  function getBreakdown(part1) {
    let breakdown = {};
    if (!part1) return breakdown;
    const val = k => part1[k]?.value ?? part1[k];
    breakdown.recentFalls =
      val("recentFalls") === "none" ? 2 :
      val("recentFalls") === "3to12" ? 4 :
      val("recentFalls") === "3mo" ? 6 :
      val("recentFalls") === "inpatient" ? 8 : 0;
    breakdown.highRiskMeds =
      val("highRiskMeds") === "none" ? 1 :
      val("highRiskMeds") === "one" ? 2 :
      val("highRiskMeds") === "two" ? 3 :
      val("highRiskMeds") === "more" ? 4 : 0;
    breakdown.psychological =
      val("psychological") === "none" ? 1 :
      val("psychological") === "mild" ? 2 :
      val("psychological") === "moderate" ? 3 :
      val("psychological") === "severe" ? 4 : 0;
    breakdown.cognitive =
      val("cognitive") === "intact" ? 1 :
      val("cognitive") === "mild" ? 2 :
      val("cognitive") === "moderate" ? 3 :
      val("cognitive") === "severe" ? 4 : 0;
    return breakdown;
  }

  const breakdown = getBreakdown(result.part1);
  const yesFactors = riskFactors.filter(f => result.part2 && result.part2[f.key]?.value === true);
  const noFactors = riskFactors.filter(f => result.part2 && result.part2[f.key]?.value === false);

  // Chart Data Preparation

  // Bar Chart Data
  const componentBreakdownData = {
    labels: ['Recent Falls', 'High Risk Meds', 'Psychological', 'Cognitive'],
    datasets: [
      {
        label: 'Current Score',
        data: [
          breakdown.recentFalls,
          breakdown.highRiskMeds,
          breakdown.psychological,
          breakdown.cognitive
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2
      },
      {
        label: 'Maximum Score',
        data: [
          maxScores.recentFalls,
          maxScores.highRiskMeds,
          maxScores.psychological,
          maxScores.cognitive
        ],
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        borderColor: 'rgba(128, 128, 128, 0.8)',
        borderWidth: 1
      }
    ]
  };

  // DOUGHNUT CHART DATA (Lines 153-162)
  const riskLevelData = {
    labels: ['Current Risk Score', 'Remaining to Maximum'],
    datasets: [
      {
        data: [score, 20 - score],
        backgroundColor: [risk.color, '#e9ecef'],
        borderColor: [risk.color, '#dee2e6'],
        borderWidth: 2
      }
    ]
  };

  // PIE CHART DATA (Lines 164-185)
  const riskFactorsData = {
    labels: ['Yes (Risk Present)', 'No (Risk Absent)', 'Not Assessed'],
    datasets: [
      {
        data: [
          yesFactors.length,
          noFactors.length,
          riskFactors.length - yesFactors.length - noFactors.length
        ],
        backgroundColor: ['#dc3545', '#28a745', '#6c757d'],
        borderColor: ['#dc3545', '#28a745', '#6c757d'],
        borderWidth: 2
      }
    ]
  };

  // Radar Chart Data
  const radarData = {
    labels: riskFactors.map(f => f.label),
    datasets: [
      {
        label: 'Risk Factor Present',
        data: riskFactors.map(f => {
          if (result.part2 && result.part2[f.key]?.value === true) return 1;
          if (result.part2 && result.part2[f.key]?.value === false) return 0;
          return 0.5;
        }),
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        pointBackgroundColor: riskFactors.map(f => {
          if (result.part2 && result.part2[f.key]?.value === true) return '#dc3545';
          if (result.part2 && result.part2[f.key]?.value === false) return '#28a745';
          return '#6c757d';
        }),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...Object.values(maxScores))
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          title: function(context) {
            const value = context[0].parsed.r;
            if (value === 0) return `Risk Factors with "No" (${noFactors.length} total)`;
            if (value === 1) return `Risk Factors with "Yes" (${yesFactors.length} total)`;
            if (value === 0.5) return `Not Assessed Factors`;
            return context[0].label;
          },
          label: function(context) {
            const factorLabel = context.label;
            const value = context.parsed.r;
            const status = value === 1 ? 'Yes (Risk Present)' : 
                          value === 0 ? 'No (Risk Absent)' : 'Not Assessed';
            return `${factorLabel}: ${status}`;
          }
        }
      }
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 1,
        pointLabels: {
          font: {
            size: 11
          },
          padding: 10
        },
        ticks: {
          stepSize: 0.5,
          callback: function(value) {
            if (value === 1) return 'Yes';
            if (value === 0.5) return 'N/A';
            if (value === 0) return 'No';
            return '';
          }
        }
      }
    }
  };

  // Progress Bar Component
  function ProgressBar({ value, max, color }) {
    const pct = Math.round((value / max) * 100);
    return (
      <div style={{ 
        background: "#eee", 
        borderRadius: 6, 
        width: 180, 
        height: 20, 
        display: "inline-block", 
        marginLeft: "auto",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 6,
          transition: "width 0.5s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: "600"
        }}>
          {pct > 15 && `${pct}%`}
        </div>
      </div>
    );
  }

  // Generate recommendations
  let recommendations = [];
  if (risk.label === "HIGH") {
    recommendations.push("Immediate falls prevention plan required.");
    recommendations.push("Consider referral to physiotherapy and occupational therapy.");
    recommendations.push("Review medications for fall risk.");
    recommendations.push("Increase supervision and consider environmental modifications.");
  } else if (risk.label === "MEDIUM") {
    recommendations.push("Monitor patient closely for changes in mobility or cognition.");
    recommendations.push("Review medications and consider adjustments.");
    recommendations.push("Educate patient and family on fall prevention strategies.");
  } else if (risk.label === "LOW") {
    recommendations.push("Continue current care plan.");
    recommendations.push("Encourage regular exercise and safe mobility.");
    recommendations.push("Reassess risk periodically.");
  }

  return (
    <>
    <Navbar />
    <div className="results-page">
      
      
      <div className="results-container">
        <h1 className="results-title">Assessment Results</h1>
        
        <div className="results-card">
          {/* Score Header */}
          <div className="score-section">
            <div className="score-value">Score: {score}/20</div>
            <div 
              className="score-badge" 
              style={{ color: risk.color, borderColor: risk.color }}
            >
              {risk.label} RISK
            </div>
          </div>
          
          <div className="results-section">
            <div className="results-section__title">Risk Prediction Score: {score} ({risk.label})</div>
          </div>

          {/* Visual Analytics */}
          <div className="results-section">
            <h3 className="results-section__title">Visual Analytics</h3>
            
            {/* Chart Grid */}
            <div className="results-grid">
              {/* DOUGHNUT CHART RENDER (Lines 343-346) */}
              <div style={{ height: "320px", padding: "16px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(154, 29, 80, 0.12)" }}>
                <h4 style={{ textAlign: "center", marginBottom: "1.2em", color: "#7a113b", fontSize: "1rem" }}>Overall Risk Score Distribution</h4>
                <Doughnut data={riskLevelData} options={chartOptions} />
              </div>

              {/* PIE CHART RENDER (Lines 349-352) */}
              <div style={{ height: "320px", padding: "16px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(154, 29, 80, 0.12)" }}>
                <h4 style={{ textAlign: "center", marginBottom: "1.2em", color: "#7a113b", fontSize: "1rem" }}>Risk Factors Assessment Summary</h4>
                <Pie data={riskFactorsData} options={chartOptions} />
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ height: "400px", marginTop: "48px", padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(154, 29, 80, 0.12)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "1.5em", color: "#7a113b", fontSize: "1rem" }}>Part 1: Component Score Breakdown</h4>
              <BarChart data={componentBreakdownData} options={barOptions} />
            </div>

            {/* Radar Chart */}
            <div style={{ height: "550px", marginTop: "48px", padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(154, 29, 80, 0.12)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "1.5em", color: "#7a113b", fontSize: "1rem" }}>Part 2: Risk Factors Assessment (Radar Chart)</h4>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Component Breakdown */}
          <div className="results-section">
            <h3 className="results-section__title">Component Breakdown</h3>
            <ul className="results-list">
              {Object.keys(breakdown).map(key => (
                <li key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {breakdown[key]} points
                  <ProgressBar value={breakdown[key]} max={maxScores[key]} color={risk.color} />
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factor Checklist */}
          <div className="results-section">
            <h3 className="results-section__title">Risk Factor Checklist (Yes/No)</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody>
                {riskFactors.map(factor => (
                  <tr key={factor.key}>
                    <td>{factor.label}</td>
                    <td style={{ textAlign: "center" }}>
                      {result.part2 && result.part2[factor.key]?.value === true ? "Yes" :
                       result.part2 && result.part2[factor.key]?.value === false ? "No" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Metrics */}
          <div className="results-section">
            <h3 className="results-section__title">Key Metrics</h3>
            <ul className="results-list">
              <li>Total Yes risk factors: {yesFactors.length}</li>
              <li>Total No risk factors: {noFactors.length}</li>
            </ul>
          </div>

          {/* Clinical Recommendations */}
          <div className="results-section">
            <h3 className="results-section__title">Clinical Recommendations</h3>
            <ul className="results-list">
              {recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="results-actions">
            <button className="btn" onClick={() => window.print()}>Print Report</button>
            <button className="btn" onClick={() => navigate("/assessment")}>Start New Assessment</button>
            <button className="btn btn-primary" onClick={() => navigate("/ai-careplan")}>AI Care Plan</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ResultsPage;
