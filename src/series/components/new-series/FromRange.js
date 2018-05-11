import * as R from "ramda";
import React from "react";

const FromRange = ({ range, setRange }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      flexDirection: "row"
    }}
  >
    <div>
      <label>Start: </label>
      <input
        type="number"
        value={range.start}
        onChange={e =>
          setRange(R.merge(range, { start: Number(e.target.value) }))
        }
      />
    </div>
    <div>
      <label>End: </label>
      <input
        type="number"
        value={range.end}
        onChange={e =>
          setRange(R.merge(range, { end: Number(e.target.value) }))
        }
      />
    </div>
    <div>
      <label>Sampling Rate: </label>
      <input
        type="number"
        value={range.rate}
        onChange={e =>
          setRange(R.merge(range, { rate: Number(e.target.value) }))
        }
      />
    </div>
  </div>
);

export default FromRange;
