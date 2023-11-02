import React from "react";

function TableContainer({ data, title }) {
  return (
    <div
      className="p-6 flex flex-col items-start  border border-[#395251ee] mb-4 rounded-[4px] backdrop-blur-[2px]"
      style={{
        background:
          "radial-gradient(44.09% 44.09% at 50% 50%, rgba(20, 32, 36, 0.75) 0%, rgba(21, 24, 29, 0.75) 100%)",
      }}
    >
      <span className="text-[#f2f2f2] font-bold uppercase text-lg block mb-4">
        {title}
      </span>
      <table className="min-w-full  ">
        <thead className="bg-black">
          <tr>
            {Object.keys(data[0]).map((singleHeader) => (
              <th
                key={singleHeader}
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#f2f2f2] uppercase"
              >
                {singleHeader}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {data.map((person, index) => (
            <tr key={index} className="">
              {Object.values(person).map((singleValue) => (
                <td
                  key={singleValue}
                  scope="col"
                  className="whitespace-nowrap px-3 py-4 text-sm text-[#f2f2f2] pl-5"
                >
                  {singleValue}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableContainer;
