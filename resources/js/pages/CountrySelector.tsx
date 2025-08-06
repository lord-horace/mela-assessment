import React, { useState } from 'react';


export default function CountrySelector({ countries }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / recordsPerPage);
  const startIdx = (currentPage - 1) * recordsPerPage;
  const paginatedCountries = filteredCountries.slice(startIdx, startIdx + recordsPerPage);

  const selectedCodes = Object.entries(selected)
    .filter(([, checked]) => checked)
    .map(([code]) => code);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const updated = { ...selected };
    paginatedCountries.forEach((country) => {
      updated[country.code] = checked;
    });
    setSelected(updated);
  };

  return (
    <div className="bg-white shadow rounded p-4 relative">
      <h2 className="text-2xl font-bold mb-4">Country Selector</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search countries!..."
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Show Selected Codes 
          <span className="ml-2">{selectedCodes.length}</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Records per page:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 30].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIdx + 1}–{Math.min(startIdx + recordsPerPage, filteredCountries.length)} of {filteredCountries.length}
        </div>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">
              <input
                type="checkbox"
                className="w-4 h-4"
                onChange={handleSelectAll}
                checked={
                  paginatedCountries.length > 0 &&
                  paginatedCountries.every((c) => selected[c.code])
                }
              />  &nbsp;Select All
            </th>
            <th className="p-2 text-left">Country Name</th>
            <th className="p-2 text-left">Code</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCountries.map((country) => (
            <tr
              key={country.code}
              className={`transition ${
                selected[country.code] ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={!!selected[country.code]}
                  onChange={() =>
                    setSelected((prev) => ({
                      ...prev,
                      [country.code]: !prev[country.code],
                    }))
                  }
                />
              </td>
              <td className="p-2">{country.name}</td>
              <td className="p-2">{country.code}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-2">Selected Codes</h3>
            <p className="text-gray-700 mb-4">
              {selectedCodes.length > 0
                ? selectedCodes.join(", ")
                : "No countries selected."}
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}