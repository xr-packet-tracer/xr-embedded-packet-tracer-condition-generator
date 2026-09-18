import React from "react";
import { Alert } from "react-bootstrap";

function ConditionBudgetAlert(props) {
  return (
    <small>
      <Alert variant={props.conditionsUsed <= 3 ? "info" : "warning"}>
        XR packet tracer limit: max 3 conditions, max 4 octets per condition.
        This {props.label} form currently uses {props.conditionsUsed} condition(s).
      </Alert>
    </small>
  );
}

export default ConditionBudgetAlert;
