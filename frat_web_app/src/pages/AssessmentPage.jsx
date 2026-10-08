import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import {
  getAssessmentDraft,
  saveAssessmentDraft,
  submitAssessment,
} from "../api/fhir";

// Initial state for Part 1 and Part 2
const initialPart1 = {
  recentFalls: "",
  highRiskMeds: "",
  psychological: "",
  cognitive: "",
};

const initialPart2 = {
  vision: null,
  mobility: null,
  transfers: null,
  behaviours: null,
  adl: null,
  equipment: null,
  footwear: null,
  environment: null,
  nutrition: null,
  continence: null,
  other: null,
};

// Risk factor checklist with descriptions
const riskFactors = [
  {
    key: "vision",
    label: "Vision",
    description:
      "Reports / observed difficulty seeing - objects / signs / finding way around",
  },
  {
    key: "mobility",
    label: "Mobility",
    description:
      "Mobility status unknown or appears unsafe / impulsive / forgets gait aid",
  },
  {
    key: "transfers",
    label: "Transfers",
    description:
      "Transfer status unknown or appears unsafe ie. over-reaches, impulsive",
  },
  {
    key: "behaviours",
    label: "Behaviours",
    description:
      "Observed or reported agitation, confusion, disorientation. Difficulty following instructions or non-compliant (observed or known)",
  },
  {
    key: "adl",
    label: "Activities of Daily Living (A.D.L's)",
    description:
      "Observed risk-taking behaviours, or reported from referrer / previous facility",
  },
  {
    key: "equipment",
    label: "Unsafe use of equipment",
    description: "Observed unsafe use of equipment",
  },
  {
    key: "footwear",
    label: "Footwear/Clothing",
    description: "Unsafe footwear / inappropriate clothing",
  },
  {
    key: "environment",
    label: "Environment",
    description:
      "Difficulties with orientation to environment i.e. areas between bed / bathroom / dining room",
  },
  {
    key: "nutrition",
    label: "Nutrition",
    description: "Underweight / low appetite",
  },
  {
    key: "continence",
    label: "Continence",
    description: "Reported or known urgency / nocturia / accidents",
  },
  {
    key: "other",
    label: "Other",
    description: "",
  },
];

// Calculate Part 1 score
function getScore(part1) {
  let score = 0;
  // Recent Falls
  if (part1.recentFalls === "none") score += 2;
  if (part1.recentFalls === "3to12") score += 4;
  if (part1.recentFalls === "3mo") score += 6;
  if (part1.recentFalls === "inpatient") score += 8;
  // High-Risk Medications
  if (part1.highRiskMeds === "none") score += 1;
  if (part1.highRiskMeds === "one") score += 2;
  if (part1.highRiskMeds === "two") score += 3;
  if (part1.highRiskMeds === "more") score += 4;
  // Psychological
  if (part1.psychological === "none") score += 1;
  if (part1.psychological === "mild") score += 2;
  if (part1.psychological === "moderate") score += 3;
  if (part1.psychological === "severe") score += 4;
  // Cognitive
  if (part1.cognitive === "intact") score += 1;
  if (part1.cognitive === "mild") score += 2;
  if (part1.cognitive === "moderate") score += 3;
  if (part1.cognitive === "severe") score += 4;
  return score;
}

// Determine risk level
function getRiskLevel(score) {
  if (score >= 16) return { label: "HIGH", color: "red" };
  if (score >= 12) return { label: "MEDIUM", color: "goldenrod" };
  if (score >= 5) return { label: "LOW", color: "green" };
  return { label: "N/A", color: "gray" };
}

function AssessmentPage() {
  const [part1, setPart1] = useState(initialPart1);
  const [part2, setPart2] = useState(initialPart2);
  const [progress, setProgress] = useState(1);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const score = getScore(part1);
  const risk = getRiskLevel(score);

  // Validation functions
  const validatePart1 = () => {
    if (!part1.recentFalls) {
      setValidationError("Please select an option for Recent Falls");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!part1.highRiskMeds) {
      setValidationError("Please select an option for Medications");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!part1.psychological) {
      setValidationError("Please select an option for Psychological");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!part1.cognitive) {
      setValidationError("Please select an option for Cognitive Status");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    setValidationError("");
    return true;
  };

  const validatePart2 = () => {
    // Check if all factors have been explicitly set (not null or undefined)
    const unansweredFactors = riskFactors.filter(
      (factor) => {
        const value = part2[factor.key];
        // Check for both null and undefined
        return value === null || value === undefined;
      }
    );

    if (unansweredFactors.length > 0) {
      // Show all missing fields, not just the first one
      const missingFields = unansweredFactors.map(f => f.label).join(", ");
      setValidationError(`Please answer all risk factor questions. Missing: ${missingFields}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    setValidationError("");
    return true;
  };

  // Fetch draft + patient info on mount (only once)
  useEffect(() => {
    // Load draft data first
    getAssessmentDraft().then((res) => {
      setPart1(res.data.part1 || initialPart1);
      setPart2(res.data.part2 || initialPart2);
    }).catch((err) => {
      console.error("Error loading draft:", err);
    });
  }, []); // Empty dependency array - only runs once on mount

  // Handlers for Part 1 & Part 2 inputs
  const handlePart1Change = (e) => {
    const { name, value } = e.target;
    setPart1((prevPart1) => ({ ...prevPart1, [name]: value }));
    // Clear validation error when user makes a selection
    if (validationError) setValidationError("");
  };

  // For Yes/No radio buttons
  const handlePart2Radio = (key, value) => {
    setPart2((prevPart2) => ({ ...prevPart2, [key]: value }));
    // Clear validation error when user makes a selection
    if (validationError) setValidationError("");
  };

  // Save draft
  const handleSaveDraft = () => {
    setSaving(true);
    saveAssessmentDraft({ part1, part2 }).finally(() => setSaving(false));
  };

  // Handle next button for Part 1
  const handleNextToPart2 = () => {
    if (validatePart1()) {
      setProgress(2);
    }
  };

  // Submit assessment
  const handleSubmit = () => {
    if (!validatePart2()) {
      return; // Stop if validation fails
    }
    
    setSubmitting(true);
    submitAssessment({
      part1,
      part2,
      risk_score: score,
      risk_level: risk.label,
    })
      .then(() => {
        navigate("/results");
      })
      .catch((error) => {
        console.error("Error submitting assessment:", error);
        setSubmitting(false);
        setValidationError("Failed to submit assessment. Please try again.");
      });
  };

  return (
    <>
     <Navbar />
     {submitting && <Loader message="Submitting assessment..." subtitle="Please wait" />}
    <main className="assessment-page">
     

      <div className="assessment-container">
        <header className="assessment-header">
          <h1>Falls Risk Assessment</h1>
          <p className="assessment-step">Step {progress} of 2</p>
          <p className="assessment-subtitle">
            {progress === 1
              ? "FRAT Part 1: Scored Assessment"
              : "FRAT Part 2: Risk Factor Checklist"}
          </p>
        </header>

        <section className="assessment-card">
          {progress === 1 && (
            <form className="frat-part1">
              {/* Recent Falls */}
              <div className="assessment-group">
                <legend>Recent Falls</legend>
                <ul className="assessment-options">
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="recentFalls"
                        value="none"
                        checked={part1.recentFalls === "none"}
                        onChange={handlePart1Change}
                        required
                      />{" "}
                      None in last 12 months (2 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="recentFalls"
                        value="3to12"
                        checked={part1.recentFalls === "3to12"}
                        onChange={handlePart1Change}
                      />{" "}
                      One or more between 3-12 months ago (4 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="recentFalls"
                        value="3mo"
                        checked={part1.recentFalls === "3mo"}
                        onChange={handlePart1Change}
                      />{" "}
                      One or more in last 3 months (6 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="recentFalls"
                        value="inpatient"
                        checked={part1.recentFalls === "inpatient"}
                        onChange={handlePart1Change}
                      />{" "}
                      One or more in last 3 months while inpatient/resident (8
                      points)
                    </label>
                  </li>
                </ul>
              </div>

              {/* Medications */}
              <div className="assessment-group">
                <legend>Medications</legend>
                <ul className="assessment-options">
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="highRiskMeds"
                        value="none"
                        checked={part1.highRiskMeds === "none"}
                        onChange={handlePart1Change}
                        required
                      />{" "}
                      Not taking any of these medications (1 point)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="highRiskMeds"
                        value="one"
                        checked={part1.highRiskMeds === "one"}
                        onChange={handlePart1Change}
                      />{" "}
                      Taking one high-risk medication (2 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="highRiskMeds"
                        value="two"
                        checked={part1.highRiskMeds === "two"}
                        onChange={handlePart1Change}
                      />{" "}
                      Taking two high-risk medications (3 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="highRiskMeds"
                        value="more"
                        checked={part1.highRiskMeds === "more"}
                        onChange={handlePart1Change}
                      />{" "}
                      Taking more than two high-risk medications (4 points)
                    </label>
                  </li>
                </ul>
              </div>

              {/* Psychological */}
              <div className="assessment-group">
                <legend>Psychological</legend>
                <ul className="assessment-options">
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="psychological"
                        value="none"
                        checked={part1.psychological === "none"}
                        onChange={handlePart1Change}
                        required
                      />{" "}
                      None (1 point)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="psychological"
                        value="mild"
                        checked={part1.psychological === "mild"}
                        onChange={handlePart1Change}
                      />{" "}
                      Mild (2 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="psychological"
                        value="moderate"
                        checked={part1.psychological === "moderate"}
                        onChange={handlePart1Change}
                      />{" "}
                      Moderate (3 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="psychological"
                        value="severe"
                        checked={part1.psychological === "severe"}
                        onChange={handlePart1Change}
                      />{" "}
                      Severe (4 points)
                    </label>
                  </li>
                </ul>
              </div>

              {/* Cognitive */}
              <div className="assessment-group">
                <legend>Cognitive Status (AMTS)</legend>
                <ul className="assessment-options">
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="cognitive"
                        value="intact"
                        checked={part1.cognitive === "intact"}
                        onChange={handlePart1Change}
                        required
                      />{" "}
                      Intact (1 point)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="cognitive"
                        value="mild"
                        checked={part1.cognitive === "mild"}
                        onChange={handlePart1Change}
                      />{" "}
                      Mild (2 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="cognitive"
                        value="moderate"
                        checked={part1.cognitive === "moderate"}
                        onChange={handlePart1Change}
                      />{" "}
                      Moderate (3 points)
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="cognitive"
                        value="severe"
                        checked={part1.cognitive === "severe"}
                        onChange={handlePart1Change}
                      />{" "}
                      Severe (4 points)
                    </label>
                  </li>
                </ul>
              </div>

              {/* Score display */}
              <div className="assessment-group">
                <span className="assessment-score">
                  <strong>Current Score:</strong> {score}/20 &nbsp;
                  <span style={{ color: risk.color, fontWeight: "bold" }}>
                    {risk.label}
                  </span>
                </span>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <div className="assessment-error" style={{
                  backgroundColor: "#fee",
                  border: "1px solid #fcc",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  color: "#c00",
                  fontWeight: "600"
                }}>
                  ⚠️ {validationError}
                </div>
              )}

              {/* Actions — Save Draft, Previous, Next */}
              <div className="assessment-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate("/patient-info")}
                >
                  Previous
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextToPart2}
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {progress === 2 && (
            <form className="frat-part2">
              <div className="assessment-group">
                <legend>FRAT Part 2: Risk Factor Checklist</legend>
              </div>

              {riskFactors.map((factor) => (
                <div key={factor.key} className="assessment-group">
                  <h3 style={{ marginBottom: 8 }}>{factor.label}</h3>
                  {factor.description && (
                    <p style={{ marginTop: 0, color: "#4b5563" }}>
                      {factor.description}
                    </p>
                  )}
                  <ul className="assessment-options">
                    <li>
                      <label>
                        <input
                          type="radio"
                          name={factor.key}
                          value="yes"
                          checked={part2[factor.key] === true}
                          onChange={() => handlePart2Radio(factor.key, true)}
                        />{" "}
                        Yes
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="radio"
                          name={factor.key}
                          value="no"
                          checked={part2[factor.key] === false}
                          onChange={() => handlePart2Radio(factor.key, false)}
                        />{" "}
                        No
                      </label>
                    </li>
                  </ul>
                </div>
              ))}

              {/* Validation Error Message */}
              {validationError && (
                <div className="assessment-error" style={{
                  backgroundColor: "#fee",
                  border: "1px solid #fcc",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  color: "#c00",
                  fontWeight: "600"
                }}>
                  ⚠️ {validationError}
                </div>
              )}

              {/* Actions — Save Draft, Previous, Submit */}
              <div className="assessment-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() => setProgress(1)}
                >
                  Previous
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit Assessment
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
    </>
  );
}

export default AssessmentPage;
