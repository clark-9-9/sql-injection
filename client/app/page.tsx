// "use client";

// import { useState } from "react";

// export default function Home() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [data, setData] = useState<
//         { id: number; username: string; email: string }[]
//     >([]);

//     const handleGetData = async (e: React.FormEvent) => {
//         e.preventDefault();
//         // Handle form submission logic here
//         console.log(searchQuery, "<--- searchQuery");
//         const response = await fetch(
//             `http://localhost:3030/api/insecure/${searchQuery || ""}`,
//             {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         const { data } = await response.json();
//         console.log(data, "<--- data");
//         setData(data);
//     };
//     return (
//         <main>
//             <header>
//                 <h1>Insecure Search</h1>
//                 <nav>
//                     <a href="./secure.html">Secure</a>
//                 </nav>
//             </header>
//             <form className="card" id="myForm" onSubmit={handleGetData}>
//                 <div className="row">
//                     <input
//                         id="searchInput"
//                         type="text"
//                         placeholder="Search username e.g. jack"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <button type="submit" id="searchBtn">
//                         Search
//                     </button>
//                     <button className="secondary">Go Secure</button>
//                 </div>
//                 <div id="message" className="msg"></div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Username</th>
//                             <th>Email</th>
//                         </tr>
//                     </thead>
//                     <tbody id="resultsBody">
//                         {data.map((item) => (
//                             <tr key={item.id}>
//                                 <td>{item.id}</td>
//                                 <td>{item.username}</td>
//                                 <td>{item.email}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </form>
//         </main>
//     );
// }

"use client";
import React, { useState } from "react";
import { Search, Lock, Unlock } from "lucide-react";

// Tailwind is assumed to be available in this environment.

/**
 * SQL Injection Demonstration Client Component
 * This component handles user input, switches between insecure/secure API calls,
 * and displays the results along with the SQL query used.
 */

// Styling for presentation
const baseClasses =
    "min-h-screen p-4 sm:p-8 bg-gray-50 flex flex-col items-center font-sans";
const cardClasses =
    "w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-10 space-y-8";
const buttonStyle =
    "px-6 py-2 rounded-lg font-bold transition duration-200 shadow-md";

const secureClasses = "bg-green-600 hover:bg-green-700 text-white";
const insecureClasses = "bg-red-600 hover:bg-red-700 text-white";

const tableHeader =
    "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
const tableCell = "px-4 py-4 whitespace-nowrap text-sm text-gray-800";

export default function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<
        {
            id: string;
            username: string;
            email: string;
        }[]
    >([]);
    const [sqlQuery, setSqlQuery] = useState("");
    const [mode, setMode] = useState("INSECURE"); // 'INSECURE' or 'SECURE'
    const [message, setMessage] = useState({ text: "", type: "" });

    const isSecure = mode === "SECURE";

    const handleGetInsecureData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure the URL is clean: uses base path if search is empty
        const url = `http://localhost:3030/api/insecure/${searchQuery}`;

        console.log(`Calling API: ${url}`);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(mode, "<-- Mode");

        // Check if the response status is not successful (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        // Safely parse the JSON response
        const responseData = await response.json();

        // Destructure the expected data structure
        const { data, sql } = responseData;

        setData(data);
        setSqlQuery(sql);
        setMessage({
            text: `${data.length} records found in ${mode} mode.`,
            type: "success",
        });
    };

    const handleGetSecureData = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalQuery = searchQuery.trim() === "" ? "" : searchQuery;
        const url = `http://localhost:3030/api/secure/${finalQuery}`;

        console.log(`Calling API: ${url}`);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(mode, "<-- Mode");

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        // Safely parse the JSON response
        const responseData = await response.json();

        // Destructure the expected data structure
        const { data, sql } = responseData;

        setData(data);
        setSqlQuery(sql);
        setMessage({
            text: `${data.length} records found in ${mode} mode.`,
            type: "success",
        });
    };

    return (
        <main className={baseClasses}>
            <div className={cardClasses}>
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        SQL Injection Demo (CS Seminar)
                    </h1>
                    <p className="text-lg text-gray-600">
                        Demonstrating the difference between insecure and secure
                        parameterized queries.
                    </p>
                </header>

                {/* Mode Selector */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setMode("INSECURE")}
                        className={`${buttonStyle} ${
                            mode === "INSECURE"
                                ? insecureClasses + " ring-4 ring-red-300"
                                : "bg-red-400 hover:bg-red-500 text-white opacity-70"
                        }`}
                    >
                        <Unlock className="inline w-5 h-5 mr-2" />
                        Insecure Mode (Vulnerable)
                    </button>
                    <button
                        onClick={() => setMode("SECURE")}
                        className={`${buttonStyle} ${
                            mode === "SECURE"
                                ? secureClasses + " ring-4 ring-green-300"
                                : "bg-green-400 hover:bg-green-500 text-white opacity-70"
                        }`}
                    >
                        <Lock className="inline w-5 h-5 mr-2" />
                        Secure Mode (Mitigated)
                    </button>
                </div>

                <p
                    className={`text-center text-xl font-semibold p-2 rounded-lg ${
                        isSecure
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    Current Mode: <span className="font-extrabold">{mode}</span>
                </p>

                {/* Search Form */}
                <form
                    className="space-y-4"
                    onSubmit={(e) =>
                        mode === "INSECURE"
                            ? handleGetInsecureData(e)
                            : handleGetSecureData(e)
                    }
                >
                    <div className="flex space-x-4">
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Search username e.g. ' OR 1=1 --"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="grow text-black p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                        />
                        <button
                            type="submit"
                            id="searchBtn"
                            className={`${buttonStyle} ${
                                isSecure ? secureClasses : insecureClasses
                            } flex items-center justify-center w-36`}
                        >
                            <Search className="w-5 h-5 mr-2" /> Search
                        </button>
                    </div>
                </form>

                {/* Message Box */}
                {message.text && (
                    <div
                        className={`p-4 rounded-lg font-medium ${
                            message.type === "success"
                                ? "bg-blue-100 text-blue-700 border-blue-400"
                                : "bg-red-100 text-red-700 border-red-400"
                        } border-l-4`}
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}

                {/* SQL Query Output */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-800">
                        Generated SQL Query (for demonstration):
                    </h3>
                    <pre className="bg-gray-800 text-yellow-300 p-4 rounded-lg overflow-x-auto text-sm shadow-inner">
                        <code className="whitespace-pre-wrap">
                            {sqlQuery || "Perform a search to see the query."}
                        </code>
                    </pre>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className={tableHeader}>ID</th>
                                <th className={tableHeader}>Username</th>
                                <th className={tableHeader}>Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className={tableCell}>{item.id}</td>
                                        <td className={tableCell}>
                                            <span className="font-medium text-gray-900">
                                                {item.username}
                                            </span>
                                        </td>
                                        <td className={tableCell}>
                                            {item.email}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No results found. Try searching 'jack'
                                        or use a malicious payload in INSECURE
                                        mode.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="text-sm text-center text-gray-500 pt-4 border-t mt-4">
                    Seminar Project: SQL Injection Vulnerability and Mitigation.
                </footer>
            </div>
        </main>
    );
}
