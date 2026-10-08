import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getPatientInfo } from "../api/fhir";

function getFullName(nameArr) {
  if (!nameArr || !nameArr.length) return "";
  const name = nameArr[0];
  return `${(name.given || []).join(" ")} ${name.family || ""}`.trim();
}

export default function PatientInfoPage() {
  const [patient, setPatient] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [observations, setObservations] = useState([]);
  const [immunizations, setImmunizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    // Check for JWT token in URL (from OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get('token');
    
    const fetchData = async () => {
      try {
        // If token exists in URL, save it
        if (jwtToken) {
          const { setAuthToken } = await import('../api/fhir');
          setAuthToken(jwtToken);
          // Remove token from URL for security
          window.history.replaceState({}, '', '/patient-info');
        }
        
        const res = await getPatientInfo();
        if (!isMounted) return;
        setPatient(res.data.patient || null);
        setConditions(res.data.conditions || []);
        setMedications(res.data.medications || []);
        setObservations(res.data.observations || []);
        setImmunizations(res.data.immunizations || []);
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to fetch patient info:', error);
        setPatient(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // AMTS (Abbreviated Mental Test Score)
  const amtsObs = observations.find(
    (obs) =>
      obs?.code?.coding?.some(
        (c) =>
          c.code === "72133-2" ||
          (c.display && c.display.toLowerCase().includes("abbreviated mental test"))
      )
  );
  const amtsScore = amtsObs ? amtsObs.valueInteger : null;

  return (
    <>
      <Navbar />
      {loading && <Loader message="Loading patient info..." subtitle="Please wait" />}

      {!loading && (
        <main className="patient-page">
          <header className="page-header">
            <h2>Patient Information</h2>
            {amtsScore !== null && (
              <span className="amts-pill" aria-label="AMTS score">
                AMTS: {amtsScore}/10
              </span>
            )}
          </header>

          {!patient ? (
            <div className="patient-shell">
              <section className="pi-card">
                Patient not found.
              </section>
            </div>
          ) : (
            <div className="patient-shell">
              {/* Two-column grid on desktop, stacks on mobile */}
              <div className="patient-grid">
                {/* Demographics */}
                <section className="pi-card" aria-labelledby="demographics">
                  <h3 id="demographics">Demographics</h3>
                  <table className="info-table" role="table">
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>{getFullName(patient.name)}</td>
                      </tr>
                      <tr>
                        <td>Patient ID</td>
                        <td>{patient.id || "—"}</td>
                      </tr>
                      <tr>
                        <td>Date of Birth</td>
                        <td>{patient.birthDate || "—"}</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>{patient.gender || "—"}</td>
                      </tr>
                      <tr>
                        <td>Hospital ID</td>
                        <td>{patient.identifier && patient.identifier[0]?.value ? patient.identifier[0].value : "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* Conditions */}
                <section className="pi-card" aria-labelledby="conditions">
                  <h3 id="conditions">Medical History (Conditions)</h3>
                  <ul className="pi-list">
                    {conditions.length > 0 ? (
                      conditions.map((cond, idx) => (
                        <li key={idx}>
                          {cond.code?.coding?.[0]?.display || "Unknown condition"}{" "}
                          ({cond.clinicalStatus?.coding?.[0]?.code || "N/A"})
                        </li>
                      ))
                    ) : (
                      <li>No recent diagnoses.</li>
                    )}
                  </ul>
                </section>

                {/* Medications */}
                <section className="pi-card" aria-labelledby="medications">
                  <h3 id="medications">Current Medications</h3>
                  <ul className="pi-list">
                    {medications.length > 0 ? (
                      medications.map((med, idx) => (
                        <li key={idx}>
                          {med.medicationCodeableConcept?.text || "Unknown medication"}
                        </li>
                      ))
                    ) : (
                      <li>No current medications.</li>
                    )}
                  </ul>
                </section>

                {/* Observations */}
                <section className="pi-card" aria-labelledby="observations">
                  <h3 id="observations">Recent Observations</h3>
                  <ul className="pi-list">
                    <li>
                      <strong>AMTS:</strong>{" "}
                      {amtsScore !== null ? `${amtsScore}/10` : "N/A"}
                    </li>
                    {observations.length > 0 &&
                      observations.map((obs, idx) => (
                        <li key={idx}>
                          {obs.code?.coding?.[0]?.display || "Observation"}:{" "}
                          {obs.valueInteger ??
                            obs.valueString ??
                            obs.valueQuantity?.value ??
                            "N/A"}
                        </li>
                      ))}
                  </ul>
                </section>

                {/* Immunizations */}
                <section className="pi-card" aria-labelledby="immunizations">
                  <h3 id="immunizations">Immunizations</h3>
                  <ul className="pi-list">
                    {immunizations.length > 0 ? (
                      immunizations.map((imm, idx) => (
                        <li key={idx}>
                          {imm.vaccineCode?.text || "Unknown vaccine"} on{" "}
                          {imm.occurrenceDateTime || "N/A"}
                        </li>
                      ))
                    ) : (
                      <li>No immunizations found.</li>
                    )}
                  </ul>
                </section>
              </div>

              {/* Page actions */}
             <div className="card-actions">
             <button className="btn btn-ghost" onClick={() => navigate("/")}>
            Back to Landing
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/assessment")}>
            Start Assessment
            </button>
            </div>

            </div>
          )}
        </main>
      )}
    </>
  );
}
