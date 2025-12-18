// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import { Line, Bar, Doughnut } from "react-chartjs-2";
// import { useSelector } from "react-redux";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const DashboardChart = () => {
//   const { darkMode } = useSelector((state) => state.theme);

//   const lineData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "July",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       ":Dec",
//     ],
//     datasets: [
//       {
//         label: "Employee Growth",
//         data: [12, 19, 15, 25, 22, 30],
//         borderColor: "rgb(59, 130, 246)",
//         backgroundColor: "rgba(59, 130, 246, 0.1)",
//         tension: 0.4,
//         borderWidth: 3,
//         pointBackgroundColor: "rgb(59, 130, 246)",
//         pointBorderColor: "#fff",
//         pointBorderWidth: 2,
//         pointRadius: 6,
//         pointHoverRadius: 8,
//       },
//     ],
//   };

//   const barData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     datasets: [
//       {
//         label: "Attendance %",
//         data: [85, 92, 78, 88, 95],
//         backgroundColor: [
//           "rgba(34, 197, 94, 0.8)",
//           "rgba(59, 130, 246, 0.8)",
//           "rgba(251, 191, 36, 0.8)",
//           "rgba(168, 85, 247, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//         ],
//         borderColor: [
//           "rgb(34, 197, 94)",
//           "rgb(59, 130, 246)",
//           "rgb(251, 191, 36)",
//           "rgb(168, 85, 247)",
//           "rgb(239, 68, 68)",
//         ],
//         borderWidth: 2,
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const doughnutData = {
//     labels: ["Present", "Absent", "Late"],
//     datasets: [
//       {
//         data: [75, 15, 10],
//         backgroundColor: [
//           "rgba(34, 197, 94, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//           "rgba(251, 191, 36, 0.8)",
//         ],
//         borderColor: [
//           "rgb(34, 197, 94)",
//           "rgb(239, 68, 68)",
//           "rgb(251, 191, 36)",
//         ],
//         borderWidth: 3,
//         hoverOffset: 8,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           boxWidth: 12,
//           padding: 20,
//           color: darkMode ? "#ffffff" : "#374151",
//           font: {
//             size: window.innerWidth < 640 ? 12 : 14,
//             weight: "600",
//           },
//         },
//       },
//       tooltip: {
//         backgroundColor: darkMode
//           ? "rgba(17, 24, 39, 0.9)"
//           : "rgba(255, 255, 255, 0.9)",
//         titleColor: darkMode ? "#ffffff" : "#111827",
//         bodyColor: darkMode ? "#ffffff" : "#111827",
//         borderColor: darkMode ? "#374151" : "#e5e7eb",
//         borderWidth: 1,
//         cornerRadius: 12,
//         padding: 12,
//         bodyFont: {
//           size: 13,
//           weight: "500",
//         },
//         titleFont: {
//           size: 14,
//           weight: "600",
//         },
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: darkMode ? "#9ca3af" : "#6b7280",
//           font: {
//             size: window.innerWidth < 640 ? 11 : 13,
//             weight: "500",
//           },
//         },
//         grid: {
//           color: darkMode
//             ? "rgba(55, 65, 81, 0.3)"
//             : "rgba(229, 231, 235, 0.5)",
//           display: window.innerWidth >= 768,
//         },
//         border: {
//           color: darkMode ? "#374151" : "#e5e7eb",
//         },
//       },
//       y: {
//         ticks: {
//           color: darkMode ? "#9ca3af" : "#6b7280",
//           font: {
//             size: window.innerWidth < 640 ? 11 : 13,
//             weight: "500",
//           },
//         },
//         grid: {
//           color: darkMode
//             ? "rgba(55, 65, 81, 0.3)"
//             : "rgba(229, 231, 235, 0.5)",
//         },
//         border: {
//           color: darkMode ? "#374151" : "#e5e7eb",
//         },
//       },
//     },
//   };

//   return (
//     <div className="space-y-8 sm:space-y-10 lg:space-y-12">
//       {/* Employee Growth Chart */}
//       <div>
//         <h3
//           className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
//             darkMode ? "text-white" : "text-gray-900"
//           }`}
//         >
//           📈 Employee Growth Trend
//         </h3>
//         <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
//           <Line data={lineData} options={chartOptions} />
//         </div>
//       </div>

//       {/* Bottom Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
//         {/* Attendance Overview */}
//         <div>
//           <h3
//             className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
//               darkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             📊 Attendance Overview
//           </h3>
//           <div className="h-[250px] sm:h-[280px] lg:h-[300px] flex items-center justify-center">
//             <Doughnut
//               data={doughnutData}
//               options={{
//                 ...chartOptions,
//                 plugins: {
//                   ...chartOptions.plugins,
//                   legend: {
//                     ...chartOptions.plugins.legend,
//                     position: "bottom",
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Weekly Attendance */}
//         <div>
//           <h3
//             className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
//               darkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             📅 Weekly Attendance
//           </h3>
//           <div className="h-[250px] sm:h-[280px] lg:h-[300px]">
//             <Bar data={barData} options={chartOptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardChart;

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardChart = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { employees } = useSelector((state) => state.employees);

  // Calculate data for charts based on employee data
  const calculateChartData = () => {
    // Example calculations - adjust based on your actual data structure
    const employeeCountByMonth = Array(12).fill(0);
    const statusCount = {
      active: 0,
      inactive: 0,
      on_leave: 0
    };
    const departmentCount = {};

    employees.forEach(employee => {
      // Count by month (assuming createdAt exists)
      const month = new Date(employee.createdAt).getMonth();
      employeeCountByMonth[month]++;
      
      // Count by status
      statusCount[employee.status]++;
      
      // Count by department
      departmentCount[employee.department] = (departmentCount[employee.department] || 0) + 1;
    });

    return {
      employeeGrowth: employeeCountByMonth,
      statusDistribution: statusCount,
      departmentDistribution: departmentCount
    };
  };

  const chartData = calculateChartData();

  // Line Chart Data - Employee Growth
  const lineData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Employee Growth",
        data: chartData.employeeGrowth,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Bar Chart Data - Department Distribution
  const barData = {
    labels: Object.keys(chartData.departmentDistribution),
    datasets: [
      {
        label: "Employees by Department",
        data: Object.values(chartData.departmentDistribution),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(251, 191, 36)",
          "rgb(168, 85, 247)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Doughnut Chart Data - Status Distribution
  const doughnutData = {
    labels: Object.keys(chartData.statusDistribution),
    datasets: [
      {
        data: Object.values(chartData.statusDistribution),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Active
          "rgba(239, 68, 68, 0.8)",  // Inactive
          "rgba(251, 191, 36, 0.8)", // On Leave
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(251, 191, 36)",
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Chart options (same as before)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 20,
          color: darkMode ? "#ffffff" : "#374151",
          font: {
            size: window.innerWidth < 640 ? 12 : 14,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: darkMode
          ? "rgba(17, 24, 39, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: darkMode ? "#ffffff" : "#111827",
        bodyColor: darkMode ? "#ffffff" : "#111827",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        bodyFont: {
          size: 13,
          weight: "500",
        },
        titleFont: {
          size: 14,
          weight: "600",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: window.innerWidth < 640 ? 11 : 13,
            weight: "500",
          },
        },
        grid: {
          color: darkMode
            ? "rgba(55, 65, 81, 0.3)"
            : "rgba(229, 231, 235, 0.5)",
          display: window.innerWidth >= 768,
        },
        border: {
          color: darkMode ? "#374151" : "#e5e7eb",
        },
      },
      y: {
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: window.innerWidth < 640 ? 11 : 13,
            weight: "500",
          },
        },
        grid: {
          color: darkMode
            ? "rgba(55, 65, 81, 0.3)"
            : "rgba(229, 231, 235, 0.5)",
        },
        border: {
          color: darkMode ? "#374151" : "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Employee Growth Chart */}
      <div>
        <h3
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          📈 Employee Growth Trend
        </h3>
        <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Status Distribution */}
        <div>
          <h3
            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            📊 Employee Status
          </h3>
          <div className="h-[250px] sm:h-[280px] lg:h-[300px] flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Department Distribution */}
        <div>
          <h3
            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            🏢 Department Distribution
          </h3>
          <div className="h-[250px] sm:h-[280px] lg:h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;