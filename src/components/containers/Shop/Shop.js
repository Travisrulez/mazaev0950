import React, {useState, useEffect} from 'react';
import {Button, Input, Modal, Switch, Table, message} from "antd";
import {connect} from "react-redux";
import {renderShop} from "../../../store/actions/shopActions";
import axios from 'axios';
import {API_FORMAT, API_URL} from "../../../Root/API";

const Shop = props => {

    useEffect(() => {
        props.renderShop();
    }, []);

    const [name, setName] = useState('');
    const [count, setCount] = useState(null);
    const [check, setCheck] = useState(false);
    const [modal, setModal] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [changeName, setChangeName] = useState('');
    const [changeCount, setChangeCount] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return (
                    <Switch checked={record.status} onChange={() => changeStatusHandler(record.id, record.status, record.name, record.count)} />
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (value, record) => (
                <div className={'column-actions'}>
                    <i className={'far fa-edit'} onClick={() => openModal(record)}/>
                    <i className={'fas fa-trash'} onClick={() => deleteHandler(record.id, record.name)}/>
                </div>
            )
        },
    ];

    const valid = ((name === '') ||(count === null) || (count === ''));

    const checkAddHandler = () => {
        setCheck(!check)
    };

    const addHandler = async () => {
        try {
            await axios.post(`${API_URL}/shop${API_FORMAT}`, {
                name,
                count,
                status: false
            });

            message.success(`Item ${name} by ${count}pcs. was successfully added`);
        } catch (e) {
            message.error(`Error with add item action`);
            console.log(e);
        }

        props.renderShop();

        setName('');
        setCount(null);
        setCheck(false)
    };

    const deleteHandler = async (id, name) => {
        try {
            await axios.delete(`${API_URL}/shop/${id}${API_FORMAT}`);

            message.success(`${name} was successfully deleted`);
        } catch (e) {
            message.error(`Error with delete item action`);
            console.log(e);
        }

        setModal(false);

        props.renderShop();
    };

    const editHandler = async (id, name, count, status) => {
        try {
            await axios.put(`${API_URL}/shop/${id}${API_FORMAT}`, {
                name: changeName === '' ? name : changeName,
                count: changeCount === '' ? count : changeCount,
                status
            });

            message.success(`${name} was successfully edited`);

            setModal(false);

            props.renderShop()
        } catch (e) {
            message.error(`Error with edit item action`);
            console.log(e)
        }
    };

    const changeStatusHandler = async (id, status, name, count) => {

        try {
            setChangeStatus(!status);

            await axios.put(`${API_URL}/shop/${id}${API_FORMAT}`, {
                count,
                name,
                status: !status
            });

            props.renderShop();

            message.success(`Status of ${name} successfully changed to ${status ? 'bought' : 'not bought'}`);
        } catch (e) {
            message.error(`Error with changing item status`);
            console.log(e)
        }
    };

    const closeModal = () => {
      setModal(false)
    };

    const openModal = data => {
      setCurrentData(data);
      setChangeName(data.name);
      setChangeCount(data.count);
      setChangeStatus(data.status);
      setModal(true)
    };


    return (
        <div className={'Shop'}>

            {Object.keys(currentData).length !== 0 ?
                <Modal
                    visible={modal}
                    onOk={closeModal}
                    onCancel={closeModal}
                    footer={[
                        <Button key={1} onClick={() => editHandler(currentData.id, currentData.name, currentData.count, currentData.status)} disabled={(changeName === '') || (changeCount === '')}>Save changes</Button>,
                        <Button key={2} onClick={() => deleteHandler(currentData.id, currentData.name)}>Delete</Button>,
                        <Button key={3} onClick={closeModal}>Cancel</Button>

                    ]}
                >
                    <div className={'modal'}>
                        <h1>Edit "{currentData.name}" item</h1>

                        <div className="modal__content">
                            <Input placeholder={'Enter the name'} value={changeName} onChange={e => setChangeName(e.target.value)} />
                            <Input placeholder={'Enter the count'} value={changeCount} type={'number'} onChange={e => setChangeCount(e.target.value)} />
                            <p>Status:  {changeStatus ? 'Yes' : 'No'}</p>
                            <Switch checked={changeStatus} onChange={() => changeStatusHandler(currentData.id, changeStatus, currentData.name, currentData.count)} />
                        </div>
                    </div>
                </Modal> : null
            }

            <div className="Shop__heading">
                <h1>Shop page</h1>
            </div>

            <div className="Shop__root">
                <div className="Shop__root_add">
                    {!check ?
                        <Button type={'primary'} onClick={checkAddHandler}>Click to Add</Button>:
                        <Button type={'primary'} onClick={checkAddHandler}>Click to Close</Button>
                    }
                </div>
                
            </div>

            {check ?
                <div className="Shop__add">
                    <Input placeholder={'Enter the name'} value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder={'Enter the count'} value={count} type={'number'} onChange={e => setCount(e.target.value)} />

                    {!valid ?
                        <Button type={'primary'} onClick={addHandler}>Confirm</Button> :
                        <Button type={'primary'} disabled>Confirm</Button>
                    }
                </div> : null
            }

            <div className="Shop__content">
                {props.shop.length !== 0 ?
                    <Table
                        dataSource={props.shop}
                        columns={columns}
                        rowClassName={record => record.status ? 'disabled' : 'active'}
                    />
                    :
                    <h3>Database is empty now</h3>
                }
            </div>
        </div>
    )
};

function mapStateToProps(state) {
    return {
        shop: state.shopReducer.shop
    }
}

function mapDispatchToProps(dispatch) {
    return {
        renderShop: () => dispatch(renderShop())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Shop);
