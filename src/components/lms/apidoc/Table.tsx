const Table = ({
  data,
  headers,
}: {
  data: Array<Array<React.ReactNode>>
  headers: Array<React.ReactNode>
}) => (
  <div
    style={{
      overflowX: "auto",
      margin: "20px 0",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }}
  >
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
      }}
    >
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={i}
              style={{
                background: "#f8fafc",
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#374151",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="table-row">
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#4b5563",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
export default Table
