import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCinic.css';
import { Button, Input, Form, Upload, message, Modal, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddClinic = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clinic, setClinic] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

    useEffect(() => {
        const fetchClinic = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/clinic/view');
                if (response.data) {
                    setClinic(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinic data', error);
            }
        };
        fetchClinic();
    }, []);

    const handleImageChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleAddSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('location', values.location);
            formData.append('contact', values.contact);
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj);
            }

            await axios.post('http://localhost:5000/api/admin/clinic/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Clinic added successfully!');
            form.resetFields();
            setFileList([]);
            setClinic(values); 
        } catch (error) {
            message.error('Failed to add clinic.');
        }
        setLoading(false);
    };

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('location', values.location);
            formData.append('contact', values.contact);
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj);
            }

            await axios.put('http://localhost:5000/api/admin/clinic/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Clinic updated successfully!');
            setClinic(values); 
            setIsUpdateModalVisible(false);
        } catch (error) {
            message.error('Failed to update clinic.');
        }
        setLoading(false);
    };
    const handleDelete = async () => {
        setLoading(true);
        try {
           
            await axios.delete(`http://localhost:5000/api/admin/clinic/remove/${clinic._id}`);
    
            message.success('Clinic deleted successfully!');
            setClinic(null);
            setFileList([]);
        } catch (error) {
            message.error('Failed to delete clinic.');
            console.error('Error deleting clinic:', error);
        }
        setLoading(false);
    };
      
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
              { field: 'Name', value: clinic.name },
              { field: 'Location', value: clinic.location },
              { field: 'Contact', value: clinic.contact },
          ]
        : [];

    return (
        <div className="add-clinic-container">
            <h1>{clinic ? 'Clinic Information' : 'Add Clinic'}</h1>
            {clinic ? (
                <div>
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                        className="clinic-table"
                    />
                    <Button type="primary" onClick={() => setIsUpdateModalVisible(true)} style={{ marginRight: '10px' }}>
                        Update
                    </Button>
                    <Button type="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddSubmit}
                    className="add-clinic-form"
                >
                    <Form.Item
                        name="name"
                        label="Clinic Name"
                        rules={[{ required: true, message: 'Please input the clinic name!' }]}
                    >
                        <Input placeholder="Enter clinic name" />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please input the location!' }]}
                    >
                        <Input placeholder="Enter location" />
                    </Form.Item>
                    <Form.Item
                        name="contact"
                        label="Contact Details"
                        rules={[{ required: true, message: 'Please input the contact details!' }]}
                    >
                        <Input placeholder="Enter contact details" />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Clinic Image"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleImageChange}
                            beforeUpload={() => false} 
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Add Clinic
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <Modal
                title="Update Clinic"
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={clinic}
                    onFinish={handleUpdate}
                    className="update-clinic-form"
                >
                    <Form.Item
                        name="name"
                        label="Clinic Name"
                        rules={[{ required: true, message: 'Please input the clinic name!' }]}
                    >
                        <Input placeholder="Enter clinic name" />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please input the location!' }]}
                    >
                        <Input placeholder="Enter location" />
                    </Form.Item>
                    <Form.Item
                        name="contact"
                        label="Contact Details"
                        rules={[{ required: true, message: 'Please input the contact details!' }]}
                    >
                        <Input placeholder="Enter contact details" />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Clinic Image"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleImageChange}
                            beforeUpload={() => false} 
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Clinic
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddClinic;
