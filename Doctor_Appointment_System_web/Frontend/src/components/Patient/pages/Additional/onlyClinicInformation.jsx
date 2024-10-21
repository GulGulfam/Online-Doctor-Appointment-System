import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';
import './Addclinic.css'; 

const AddClinic = () => {
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinic = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/admin/clinic/view');
                if (response.data) {
                    setClinic(response.data);
                    console.log('Clinic data fetched:', response.data);
                }
            } catch (error) {
                message.error('Failed to fetch clinic data.');
                console.error('Failed to fetch clinic data', error);
            }
            setLoading(false);
        };

        fetchClinic();
    }, []);

    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const data = clinic
        ? [
              { key: 'name', field: 'Name', value: clinic.name },
              { key: 'location', field: 'Location', value: clinic.location },
              { key: 'contact', field: 'Contact', value: clinic.contact },
          ]
        : [];

    return (
        <div className="add-clinic-container">
            <h1 className="title">Clinic Information</h1>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : clinic ? (
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    className="clinic-table"
                />
            ) : (
                <p className="no-clinic-text">No clinic found.</p>
            )}
        </div>
    );
};

export default AddClinic;
