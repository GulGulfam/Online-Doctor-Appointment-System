import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Input } from 'antd';
import './ViewReport.css';

const ViewReport = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentReport, setCurrentReport] = useState(null);
    const [deleteReportId, setDeleteReportId] = useState(null);

    // Fetch reports on component mount
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reports');
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (err) {
                setError('Error fetching reports.');
                console.error(err);
            }
        };

        fetchReports();
    }, []);

    // Filter reports based on search query
    useEffect(() => {
        setFilteredReports(
            reports.filter(report =>
                report.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, reports]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle edit button click
    const handleEdit = (report) => {
        setCurrentReport(report);
        setIsModalOpen(true);
    };

    // Handle delete button click
    const handleDelete = (id) => {
        setDeleteReportId(id);
        setIsDeleteModalOpen(true);
    };

    // Handle update report
    const handleUpdate = async (values) => {
        try {
            await axios.put(`http://localhost:5000/api/reports/${currentReport._id}`, values);
            setIsModalOpen(false);
            setCurrentReport(null);
            alert('Report updated successfully.');
            // Refresh report list
            const response = await axios.get('http://localhost:5000/api/reports');
            setReports(response.data);
            setFilteredReports(response.data);
        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            setError('Error updating report.');
        }
    };

    // Handle delete report
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/reports/${deleteReportId}`);
            setIsDeleteModalOpen(false);
            setDeleteReportId(null);
            alert('Report deleted successfully.');
            // Refresh report list
            const response = await axios.get('http://localhost:5000/api/reports');
            setReports(response.data);
            setFilteredReports(response.data);
        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            setError('Error deleting report.');
        }
    };

    return (
        <div className="view-report-container">
            <h1>View Reports</h1>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <div className="report-list">
                {filteredReports.map(report => (
                    <div key={report._id} className="report-item">
                        <h2>{report.name}</h2>
                        <p>Disease: {report.disease}</p>
                        <p>Level: {report.level}</p>
                        <p>Symptoms Date: {new Date(report.symptomsDate).toLocaleDateString()}</p>
                        <button onClick={() => handleEdit(report)}>Edit</button>
                        <button onClick={() => handleDelete(report._id)}>Delete</button>
                    </div>
                ))}
            </div>
            {/* Edit Report Modal */}
            <Modal
                title="Edit Report"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    initialValues={currentReport}
                    onFinish={handleUpdate}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="disease"
                        label="Disease"
                        rules={[{ required: true, message: 'Please input the disease!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[{ required: true, message: 'Please input the level!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="symptomsDate"
                        label="Symptoms Date"
                        rules={[{ required: true, message: 'Please input the symptoms date!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Report
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                visible={isDeleteModalOpen}
                onOk={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to delete this report?</p>
            </Modal>
        </div>
    );
};

export default ViewReport;
