import "./styles.css";
import { useEffect, useState } from "react";
import { tenureData } from "./utils/constants";
import { numberWithCommas } from "./utils/config";

export default function App() {
  // Todo validation for percentage and permissible values
  const [totalCost, setTotalCost] = useState(0);
  const [interestRate, setInterestRate] = useState(10);
  const [processingCharge, setProcessingCharge] = useState(1);
  const [downPayment, setDownPayment] = useState(0);
  const [emi, setEmi] = useState(0);
  const [tenure, setTenure] = useState(12);

  const calculateEmi = (downPmt) => {
    if (!totalCost) {
      return;
    }

    console.log("totalCost", totalCost, downPmt);

    const loan_amt = totalCost - downPmt;
    const rate = interestRate / 100;
    const years = tenure / 12;

    const yearlyInstallment =
      (loan_amt * rate * (1 + rate) ** years) / (1 + rate ** years - 1);

    return Number(yearlyInstallment / 12).toFixed(0);
  };

  const calculateDownPayment = (emi) => {
    if (!totalCost) {
      return;
    }

    const dpPercent = (100 - (emi / calculateEmi(0)) * 100) / 100;
    return (Number(dpPercent) * totalCost).toFixed(0);
  };

  const updateEmi = (e) => {
    if (!totalCost) {
      return;
    }

    const newDp = Number(e.target.value);
    setDownPayment(newDp.toFixed(0));

    const emi = calculateEmi(newDp);
    setEmi(emi);
  };

  const updateDownPayment = (e) => {
    if (!totalCost) {
      return;
    }

    const newEmi = Number(e.target.value);
    setEmi(newEmi);

    const newDp = calculateDownPayment(newEmi);
    setDownPayment(newDp);
  };

  useEffect(() => {
    if (!(totalCost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }

    setEmi(calculateEmi(downPayment));
  }, [tenure, totalCost]);

  const totalDownPayment = () => {
    return numberWithCommas(
      (
        Number(downPayment) +
        (totalCost - downPayment) * (processingCharge / 100)
      ).toFixed(0)
    );
  };

  const totalEMI = () => {
    return numberWithCommas((emi * tenure || 0).toFixed(0));
  };

  return (
    <div className="App">
      <span className="title">EMI Calculator</span>

      <div className="input_container">
        Total Cost of Asset
        <input
          type="number"
          placeholder="0"
          value={totalCost}
          onChange={(e) => setTotalCost(e.target.value)}
        />
      </div>

      <div className="input_container">
        Interest Rate (in %)
        <input
          type="number"
          placeholder="0"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>

      <div className="input_container">
        Processing Charge (in %)
        <input
          type="number"
          placeholder="0"
          value={processingCharge}
          onChange={(e) => setProcessingCharge(e.target.value)}
        />
      </div>

      <div className="input_container">
        Down Payment
        <div className="total_value">
          <span>Total Down Payment</span> -{totalDownPayment()}
        </div>
        <input
          type="range"
          placeholder="0"
          min={0}
          max={totalCost}
          value={downPayment}
          onChange={updateEmi}
        />
        <div className="labels">
          <div>0 %</div>
          <b>{downPayment}</b>
          <div>100 %</div>
        </div>
      </div>

      <div className="input_container">
        EMI
        <div className="total_value">
          <span>Total Loan Amount</span> - {totalEMI()}
        </div>
        <input
          type="range"
          placeholder="0"
          min={calculateEmi(totalCost)}
          max={calculateEmi(0)}
          value={emi}
          onChange={updateDownPayment}
        />
        <div className="labels">
          <div>{calculateEmi(totalCost)}</div>
          <b>{emi}</b>
          <div>{calculateEmi(0)}</div>
        </div>
      </div>

      <div className="input_container">
        Tenure
        <span className="tenure_container">
          {tenureData.map((tenureItem) => (
            <button
              key={tenureItem}
              className={`tenure_btn ${
                tenureItem === tenure ? "selected_tenure" : ""
              }`}
              onClick={() => setTenure(tenureItem)}
            >
              {tenureItem}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
