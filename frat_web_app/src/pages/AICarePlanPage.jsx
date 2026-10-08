import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAssessmentResult, generateCarePlan } from "../api/fhir";
import { useNavigate } from "react-router-dom";
import "./aiCarePlan.css";

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

function AICarePlanPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [carePlan, setCarePlan] = useState(null);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [riskLevel, setRiskLevel] = useState("");
  const [riskScore, setRiskScore] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemma");
  const navigate = useNavigate();

  const modelOptions = [
    { id: "gemma", name: "Gemma 3-27B IT (Free)", description: "Advanced reasoning model by Google, completely free" },
    { id: "nemotron-nano", name: "NVIDIA Nemotron Nano 9B (Free)", description: "Fast and efficient free model" },
    { id: "gpt-oss-20b", name: "GPT OSS 20B (Free)", description: "Open-source GPT model, free to use" }
  ];

  useEffect(() => {
    getAssessmentResult()
      .then(res => {
        const info = res.data.patient_info;
        const assessments = res.data.assessments || [];
        const latest = assessments[assessments.length - 1];
        setPatientInfo(info);
        setAssessment(latest);
        setRiskScore(latest?.risk_score ?? "");
        setRiskLevel(latest?.risk_level ?? "");
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load patient assessment data.");
        setLoading(false);
      });
  }, []);

  async function handleGenerateCarePlan() {
    setGenerating(true);
    setError("");
    setCarePlan(null); // Clear previous results
    try {
      const response = await generateCarePlan({
        patient_info: patientInfo,
        assessment,
        risk_level: riskLevel,
        risk_score: riskScore,
        model_id: selectedModel
      });
      setCarePlan({
        ...response.data,
        model_used: selectedModel,
        model_name: modelOptions.find(m => m.id === selectedModel)?.name
      });
    } catch (err) {
      console.error("AI Care Plan generation error:", err);
      setError("AI Care Plan generation failed. Please check console for details.");
    }
    setGenerating(false);
  }

  const yesFactors = riskFactors.filter(f => assessment?.part2?.[f.key]?.value === true);
  const noFactors  = riskFactors.filter(f => assessment?.part2?.[f.key]?.value === false);

  return (
    <>
    <Navbar />
    <div className="ai-wrap">
      
      <div className="ai-card">
        <div className="ai-header">
          <span className="ai-badge">FRAT</span>
          <h2 className="ai-title">AI Care Plan</h2>
        </div>

        {loading && <div className="ai-loading">Loading…</div>}
        {!!error && <div className="ai-error">{error}</div>}

        {!loading && !error && (
          <>
            {/* Patient information */}
            <section className="ai-section">
              <h3>Patient Information</h3>
              <div className="ai-info-grid">
                <p className="ai-info-item"><strong>Name:</strong> {patientInfo?.name}</p>
                <p className="ai-info-item"><strong>ID:</strong> {patientInfo?.id}</p>
                <p className="ai-info-item"><strong>DOB:</strong> {patientInfo?.birthDate}</p>
                <p className="ai-info-item"><strong>Gender:</strong> {patientInfo?.gender}</p>
                <p className="ai-info-item"><strong>Hospital ID:</strong> {patientInfo?.hospital_id}</p>
                <p className="ai-info-item"><strong>AMTS Score:</strong> {patientInfo?.amts_score ?? "N/A"}</p>
              </div>
              <div className="ai-subcard" style={{marginTop: 12}}>
                <p><strong>Medical History:</strong> {patientInfo?.medical_history?.join(", ")}</p>
                <p><strong>Medications:</strong> {patientInfo?.medications?.join(", ")}</p>
                <p><strong>Observations:</strong> {patientInfo?.observations?.join(", ")}</p>
                <p><strong>Immunizations:</strong> {patientInfo?.immunizations?.join(", ")}</p>
              </div>
            </section>

            {/* Latest assessment */}
            <section className="ai-section">
              <h3>Latest Assessment</h3>
              <p><strong>Risk Level:</strong> {riskLevel}</p>
              <p><strong>Risk Score:</strong> {riskScore}</p>

              <h4 style={{marginTop: 10}}>Risk Factor Checklist (Yes/No)</h4>
              <table className="ai-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th className="center">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {riskFactors.map(factor => (
                    <tr key={factor.key}>
                      <td>{factor.label}</td>
                      <td className="center">
                        {assessment?.part2?.[factor.key]?.value === true
                          ? "Yes"
                          : assessment?.part2?.[factor.key]?.value === false
                          ? "No"
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ai-subcard" style={{marginTop: 12}}>
                <strong>Key Metrics:</strong>
                <ul style={{margin: "8px 0 0 18px"}}>
                  <li>Total Yes risk factors: {yesFactors.length}</li>
                  <li>Total No risk factors: {noFactors.length}</li>
                </ul>
              </div>
            </section>

            {/* Model picker + actions */}
            <section className="ai-section">
              <h3>Select AI Model</h3>
              <div className="ai-model">
                {modelOptions.map(model => (
                  <label key={model.id}>
                    <input
                      type="radio"
                      name="model"
                      value={model.id}
                      checked={selectedModel === model.id}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    />
                    <span className="name">{model.name}</span>
                    <span className="desc">— {model.description}</span>
                  </label>
                ))}
              </div>

              <div className="ai-actions">
                <button className="btn btn-primary" onClick={handleGenerateCarePlan} disabled={generating}>
                  {generating ? "Generating…" : "Generate AI Care Plan"}
                </button>
                {carePlan && (
                  <button className="btn btn-secondary" onClick={() => setCarePlan(null)}>
                    Clear Results
                  </button>
                )}
              </div>
            </section>

            {/* AI output with loading state */}
            {generating && (
              <section className="ai-section">
                <div className="ai-subcard ai-generating">
                  <div className="ai-spinner"></div>
                  <p style={{ textAlign: "center", marginTop: 16, fontSize: "1.1rem", color: "#666" }}>
                    Generating AI Care Plan with {modelOptions.find(m => m.id === selectedModel)?.name}...
                  </p>
                </div>
              </section>
            )}

            {carePlan && !generating && (
              <section className="ai-section">
                <div className="ai-subcard">
                  <h3>AI Recommendations</h3>
                  <p><strong>Generated by:</strong> {carePlan.model_name}</p>
                  <p><strong>Risk Level:</strong> {carePlan.risk_level}</p>
                  <div>
                    <strong>Care Plan:</strong>
                    <ol style={{marginTop: 6}}>
                      {carePlan.care_plan.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ol>
                  </div>
                  <div style={{marginTop: 10}}>
                    <strong>Rationale:</strong>
                    <p>{carePlan.rationale}</p>
                  </div>
                </div>
              </section>
            )}

            <div className="ai-footer">
              <button className="btn btn-secondary" onClick={() => navigate("/results")}>
                Back to Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default AICarePlanPage;