import React, { useEffect, useState } from 'react';
import { example_backend } from 'declarations/example_backend';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Ensure you import Chart.js

function AnalyticsPage() {
  const [apartments, setApartments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Successful Bookings',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [statusChartData, setStatusChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Booking Status',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apartmentsList = await example_backend.getHouse();
        const bookingsList = await example_backend.getBookings();

        setApartments(apartmentsList);
        setBookings(bookingsList);

        const apartmentNames = apartmentsList.map(apartment => apartment.name);
        const successfulBookingsCount = {};

        bookingsList.forEach(booking => {
          const apartmentName = apartmentsList.find(apartment => apartment.id === booking.apartmentId)?.name;
          if (apartmentName) {
            if (booking.paymentStatus && booking.paymentStatus.trim() !== '') {
              if (!successfulBookingsCount[apartmentName]) {
                successfulBookingsCount[apartmentName] = 0;
              }
              successfulBookingsCount[apartmentName] += 1;
            }
          }
        });

        const labels = apartmentNames;
        const data = apartmentNames.map(name => successfulBookingsCount[name] || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Successful Bookings',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        const statusCounts = bookingsList.reduce((acc, booking) => {
          const status = booking.paymentStatus || 'pending';
          if (!acc[status]) {
            acc[status] = 0;
          }
          acc[status] += 1;
          return acc;
        }, {});

        setStatusChartData({
          labels: Object.keys(statusCounts),
          datasets: [
            {
              label: 'Booking Status',
              data: Object.values(statusCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Analytics</h2>
      <div className="row">
        {/* Successful Bookings Chart */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Successful Bookings by Apartment</h5>
              <div style={{ position: 'relative', height: '300px' }}>
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Booking Status Distribution</h5>
              <div style={{ position: 'relative', height: '300px' }}>
                <Pie
                  data={statusChartData}
                  options={{
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
